package procinfo

import (
	"time"

	linuxproc "github.com/olivierlemasle/go-top/Godeps/_workspace/src/github.com/c9s/goprocinfo/linux"
)

// GetCPULoad ...
func GetCPULoad() ([]int, error) {
	oldStat, err := linuxproc.ReadStat("/proc/stat")
	if err != nil {
		return nil, err
	}

	time.Sleep(500 * time.Millisecond)

	newStat, err := linuxproc.ReadStat("/proc/stat")
	if err != nil {
		return nil, err
	}

	var res []int

	for i, s := range newStat.CPUStats {
		previous := oldStat.CPUStats[i]

		prevIdle := previous.Idle + previous.IOWait
		idle := s.Idle + s.IOWait

		prevNonIdle := previous.User + previous.Nice + previous.System + previous.IRQ + previous.SoftIRQ + previous.Steal
		nonIdle := s.User + s.Nice + s.System + s.IRQ + s.SoftIRQ + s.Steal

		prevTotal := prevIdle + prevNonIdle
		total := idle + nonIdle

		totald := total - prevTotal
		idled := idle - prevIdle

		CPUPercentage := int(float64(totald-idled) / float64(totald) * 100)

		res = append(res, CPUPercentage)
	}

	return res, nil
}
