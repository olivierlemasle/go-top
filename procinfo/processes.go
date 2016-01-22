package procinfo

import linuxproc "github.com/olivierlemasle/go-top/Godeps/_workspace/src/github.com/c9s/goprocinfo/linux"

// ListProcesses ...
func ListProcesses() ([]*linuxproc.Process, error) {
	maxPid, err := linuxproc.ReadMaxPID("/proc/sys/kernel/pid_max")
	if err != nil {
		return nil, err
	}

	pids, err := linuxproc.ListPID("/proc/", maxPid)
	if err != nil {
		return nil, err
	}

	processes := make([]*linuxproc.Process, len(pids))
	for i, pid := range pids {
		process, err := linuxproc.ReadProcess(pid, "/proc/")
		if err != nil {
			continue
		}

		processes[i] = process
	}
	return processes, nil
}
