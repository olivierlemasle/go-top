package procinfo

import (
	"time"

	linuxproc "github.com/c9s/goprocinfo/linux"
)

// GetCPUNumber returns the number of CPU (from /proc/cpuinfo)
func GetCPUNumber() (int, error) {
	info, err := linuxproc.ReadCPUInfo("/proc/cpuinfo")
	if err != nil {
		return 0, err
	}
	return info.NumCPU(), nil
}

// GetCPULoad returns the CPU load, as an array of integer. For each CPU, the integer value is the usage percentage.
//
// This method get info from /proc/stat over 500 milliseconds.
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

	for i, currentStat := range newStat.CPUStats {
		previousStat := oldStat.CPUStats[i]
		res = append(res, getCPUUsagePercentage(previousStat, currentStat))
	}

	return res, nil
}

func getCPUUsagePercentage(stat1, stat2 linuxproc.CPUStat) int {
	idle1 := getIdle(stat1)
	idle2 := getIdle(stat2)

	used1 := getUsed(stat1)
	used2 := getUsed(stat2)

	total1 := idle1 + used1
	total2 := idle2 + used2

	totalDiff := float64(total2 - total1)
	usedDiff := float64(used2 - used1)

	return int(usedDiff / totalDiff * 100)
}

func getIdle(stat linuxproc.CPUStat) uint64 {
	return stat.Idle + stat.IOWait
}

func getUsed(stat linuxproc.CPUStat) uint64 {
	return stat.User + stat.Nice + stat.System + stat.IRQ + stat.SoftIRQ + stat.Steal
}
