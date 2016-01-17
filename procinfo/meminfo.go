package procinfo

import linuxproc "github.com/olivierlemasle/go-top/Godeps/_workspace/src/github.com/c9s/goprocinfo/linux"

// GetUsedMemory returns the physical used memory in kb
func GetUsedMemory() (int, error) {
	memInfo, err := linuxproc.ReadMemInfo("/proc/meminfo")
	if err != nil {
		return 0, err
	}

	total := memInfo.MemTotal
	free := memInfo.MemFree
	buffers := memInfo.Buffers
	cache := memInfo.Cached + memInfo.Slab

	used := total - free - buffers - cache
	usedInt := int(used)

	return usedInt, nil
}
