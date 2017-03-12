package procinfo

import linuxproc "github.com/c9s/goprocinfo/linux"

// GetUsedAndAvailableMemory returns the physical used memory and available memory in kb
func GetUsedAndAvailableMemory() (int, int, error) {
	memInfo, err := linuxproc.ReadMemInfo("/proc/meminfo")
	if err != nil {
		return 0, 0, err
	}

	total := memInfo.MemTotal
	free := memInfo.MemFree
	buffers := memInfo.Buffers
	cache := memInfo.Cached + memInfo.Slab

	used := total - free - buffers - cache
	usedInt := int(used)
	availableInt := int(free + buffers + cache)

	return usedInt, availableInt, nil
}
