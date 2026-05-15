package routes

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

// RunCommand handles the execution of code in various languages
func RunCommand(language, code string, roomId string, c *websocket.Conn, writeMu *sync.Mutex) {
	tempDir := filepath.Join(os.TempDir(), "campuscore", roomId)
	os.MkdirAll(tempDir, 0755)
	defer os.RemoveAll(tempDir)

	var cmd *exec.Cmd
	var fileName string

	broadcast := func(msg string) {
		writeMu.Lock()
		defer writeMu.Unlock()
		c.WriteJSON(fiber.Map{
			"type": "TERMINAL_DATA",
			"text": msg,
		})
	}

	broadcast(fmt.Sprintf("\n[System] Initializing %s execution engine...\n", strings.ToUpper(language)))

	// Check for necessary binaries
	checkBinary := func(bin string) bool {
		_, err := exec.LookPath(bin)
		if err != nil {
			broadcast(fmt.Sprintf("\x1b[31mError: '%s' binary not found in system PATH.\x1b[0m\n", bin))
			return false
		}
		return true
	}

	switch language {
	case "c":
		if !checkBinary("gcc") { return }
		fileName = filepath.Join(tempDir, "main.c")
		os.WriteFile(fileName, []byte(code), 0644)
		exePath := filepath.Join(tempDir, "main.exe")
		if runtime.GOOS != "windows" {
			exePath = filepath.Join(tempDir, "main")
		}

		broadcast("> gcc main.c -o main\n")
		compileCmd := exec.Command("gcc", fileName, "-o", exePath)
		if output, err := compileCmd.CombinedOutput(); err != nil {
			broadcast(fmt.Sprintf("\x1b[31mCompilation Error:\n%s\x1b[0m\n", string(output)))
			return
		}

		broadcast("> ./main\n")
		cmd = exec.Command(exePath)

	case "cpp":
		if !checkBinary("g++") { return }
		fileName = filepath.Join(tempDir, "main.cpp")
		os.WriteFile(fileName, []byte(code), 0644)
		exePath := filepath.Join(tempDir, "main.exe")
		if runtime.GOOS != "windows" {
			exePath = filepath.Join(tempDir, "main")
		}

		broadcast("> g++ main.cpp -o main\n")
		compileCmd := exec.Command("g++", fileName, "-o", exePath)
		if output, err := compileCmd.CombinedOutput(); err != nil {
			broadcast(fmt.Sprintf("\x1b[31mCompilation Error:\n%s\x1b[0m\n", string(output)))
			return
		}

		broadcast("> ./main\n")
		cmd = exec.Command(exePath)

	case "python", "python3":
		bin := "python3"
		if _, err := exec.LookPath(bin); err != nil {
			bin = "python"
			if _, err := exec.LookPath(bin); err != nil {
				broadcast("\x1b[31mError: Python binary not found in system PATH.\x1b[0m\n")
				return
			}
		}
		
		fileName = filepath.Join(tempDir, "script.py")
		os.WriteFile(fileName, []byte(code), 0644)
		broadcast(fmt.Sprintf("> %s script.py\n", bin))
		cmd = exec.Command(bin, fileName)

	case "java":
		if !checkBinary("javac") || !checkBinary("java") { return }
		className := "Main"
		if strings.Contains(code, "public class ") {
			parts := strings.Split(code, "public class ")
			if len(parts) > 1 {
				className = strings.Fields(parts[1])[0]
			}
		}
		fileName = filepath.Join(tempDir, className+".java")
		os.WriteFile(fileName, []byte(code), 0644)

		broadcast(fmt.Sprintf("> javac %s.java\n", className))
		compileCmd := exec.Command("javac", fileName)
		if output, err := compileCmd.CombinedOutput(); err != nil {
			broadcast(fmt.Sprintf("\x1b[31mCompilation Error:\n%s\x1b[0m\n", string(output)))
			return
		}

		broadcast(fmt.Sprintf("> java %s\n", className))
		cmd = exec.Command("java", "-cp", tempDir, className)

	case "javascript":
		if !checkBinary("node") { return }
		fileName = filepath.Join(tempDir, "script.js")
		os.WriteFile(fileName, []byte(code), 0644)
		broadcast("> node script.js\n")
		cmd = exec.Command("node", fileName)

	default:
		broadcast(fmt.Sprintf("\x1b[33mError: Language '%s' is not supported for execution yet.\x1b[0m\n", language))
		return
	}

	stdout, _ := cmd.StdoutPipe()
	stderr, _ := cmd.StderrPipe()

	if err := cmd.Start(); err != nil {
		broadcast(fmt.Sprintf("\x1b[31mExecution Error: %v\x1b[0m\n", err))
		return
	}

	// Stream output
	var wg sync.WaitGroup
	wg.Add(2)

	stream := func(pipe interface{}, color bool) {
		defer wg.Done()
		buf := make([]byte, 1024)
		for {
			var n int
			var err error
			if p, ok := pipe.(interface{ Read([]byte) (int, error) }); ok {
				n, err = p.Read(buf)
			}
			if n > 0 {
				text := string(buf[:n])
				if color {
					text = fmt.Sprintf("\x1b[31m%s\x1b[0m", text)
				}
				broadcast(text)
			}
			if err != nil {
				break
			}
		}
	}

	go stream(stdout, false)
	go stream(stderr, true)

	done := make(chan error, 1)
	go func() {
		wg.Wait()
		done <- cmd.Wait()
	}()

	select {
	case <-time.After(15 * time.Second):
		if cmd.Process != nil {
			cmd.Process.Kill()
		}
		broadcast("\n\x1b[31mExecution Timed Out (15s limit)\x1b[0m\n")
	case err := <-done:
		if err != nil {
			broadcast(fmt.Sprintf("\n\x1b[31mProcess exited with error: %v\x1b[0m\n", err))
		} else {
			broadcast("\n\x1b[32mProcess finished successfully.\x1b[0m\n")
		}
	}
}
