function AssignModules() {
    const jobSelect = document.getElementById('jobSelect');
    const selectedOption = jobSelect.options[jobSelect.selectedIndex];
    
    const selectedJob = selectedOption.value;
    const modules = selectedOption.getAttribute('data-modules');
    
    if (selectedJob && modules) {
        localStorage.setItem('selectedJob', selectedJob);
        localStorage.setItem('assignedModules', modules);
        localStorage.setItem('site_lang', 'de');
    }
}

function restoreSelection() {
    const jobSelect = document.getElementById('jobSelect');
    
    const savedJob = localStorage.getItem('selectedJob');
    
    if (savedJob) {
        for (let i = 0; i < jobSelect.options.length; i++) {
            if (jobSelect.options[i].value === savedJob) {
                jobSelect.selectedIndex = i;
                break;
            }
        }
    }
    
    AssignModules();
}

document.getElementById('jobSelect').addEventListener('change', AssignModules);
window.onload = restoreSelection;