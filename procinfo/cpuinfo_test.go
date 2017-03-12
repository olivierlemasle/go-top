package procinfo

import (
	"testing"

	linuxproc "github.com/c9s/goprocinfo/linux"
)

func TestCPUUsagePercentageIdle(t *testing.T) {
	stat1 := createCPUStat(0)
	stat2 := createCPUStat(0)

	// Increase "Idle" values
	stat2.Idle += 1000
	stat2.IOWait += 1000

	usage := getCPUUsagePercentage(stat1, stat2)
	expected := 0
	if usage != expected {
		t.Errorf("Usage is %d and should be %d", usage, expected)
	}
}

func TestCPUUsagePercentageUsed(t *testing.T) {
	stat1 := createCPUStat(0)
	stat2 := createCPUStat(0)

	// Increase "Non-idle" value
	stat2.User += 1000

	usage := getCPUUsagePercentage(stat1, stat2)
	expected := 100
	if usage != expected {
		t.Errorf("Usage is %d and should be %d", usage, expected)
	}
}

func TestCPUUsagePercentageMixed(t *testing.T) {
	stat1 := createCPUStat(10000)
	stat2 := createCPUStat(10000)

	// Increase "Non-idle" values
	stat2.System += 1500
	stat2.Nice += 500

	// Increase "Idle" values
	stat2.Idle += 1000
	stat2.IOWait += 1000

	usage := getCPUUsagePercentage(stat1, stat2)
	expected := 50
	if usage != expected {
		t.Errorf("Usage is %d and should be %d", usage, expected)
	}
}

func TestCPUUsagePercentageRounding(t *testing.T) {
	stat1 := createCPUStat(2000)
	stat2 := createCPUStat(2000)

	// Increase "Non-idle" values
	stat2.System += 1000

	// Increase "Idle" values
	stat2.IOWait += 1000
	stat2.Idle += 1000

	usage := getCPUUsagePercentage(stat1, stat2)
	expected := 33
	if usage != expected {
		t.Errorf("Usage is %d and should be %d", usage, expected)
	}
}

func createCPUStat(i uint64) linuxproc.CPUStat {
	return linuxproc.CPUStat{
		Id:        "1",
		User:      i,
		Nice:      i,
		System:    i,
		Idle:      i,
		IOWait:    i,
		IRQ:       i,
		SoftIRQ:   i,
		Steal:     i,
		Guest:     i,
		GuestNice: i,
	}
}
