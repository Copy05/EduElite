export class Languages {
    static ENGLISH = "en";
    static GERMAN = "de";
}

export class Modules {
    static IT_SYSTEMADMINISTRATION = "it_sysadmin";
}

export function LoadData(lang = Languages, module = Modules) {
    const url = `./data/${module}_${lang}.json`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading data: ${response.statusText}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            throw error;
        });
}


export function LoadTotalQuestions() {
    const assignedModules = localStorage.getItem("assignedModules");

    if (!assignedModules) {
        console.warn('No assigned modules found in localStorage.');
        return Promise.resolve(0);
    }

    const moduleArray = assignedModules.split(',').map(module => module.trim());

    const allJson = moduleArray.map(module => `./data/${module.replace("-", "_")}_${localStorage.getItem("site_lang")}.json`);

    const fetchPromises = allJson.map(url => {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error loading data: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                return data.questions ? data.questions.length : 0;
            });
    });

    return Promise.all(fetchPromises)
        .then(questionCounts => {
            const totalQuestions = questionCounts.reduce((acc, count) => acc + count, 0);
            return totalQuestions;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            throw error;
        });
}