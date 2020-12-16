const inputElement = document.getElementById("input");
const errorElement = document.getElementById("error");
const searchBtn = document.getElementById("submit");
const results = document.getElementById("results");
const apiPath = `https://payload.tf/api/external/rgl/`;
const re = /(765611\d+)|(STEAM_[01]\:[01]\:\d+)|(\[U\:[01]\:\d+\])/gi;

const sixesChecked = document.getElementById("6s-check");
const hlChecked = document.getElementById("hl-check");
const plChecked = document.getElementById("pl-check");

let isLoading = false;

inputElement.addEventListener("click", () => {
    errorElement.innerText = "";
    if (results && isLoading === false) results.innerHTML = "";
    else errorElement.innerText = "Please wait for the results to load before clearing."
})

searchBtn.addEventListener("click", async () => {
    errorElement.innerText = "";

    const ids = [...inputElement.value.matchAll(re) || []].map(match => match[0]);
    isLoading = true;
    if (ids.length == 0) errorElement.innerText = `Need at least 1 ID to continue!`;

    const lookUpResults = ids.map(async id => {
        const log = document.getElementById("results").appendChild(document.createElement("div"));

        let idPath;
        try {
            log.innerText = `${id} searching...`;

            let res = await fetch(apiPath + id);
            res = await res.json();

            if (res.error) {
                log.innerText = `${id} failed: ${res.error}`;
                return "";
            }

            idPath = `https://rgl.gg/Public/PlayerProfile.aspx?p=${res.steamid}`;

            let table = `
                <table class="table table-striped">
                    <tr>
                        <th class="text-center">Season</th>
                        <th class="text-center">Div</th>
                        <th class="text-center">Team</th>
                        <th class="text-center">End Rank</th>
                        <th class="text-center">Record<br />With</th>
                        <th class="text-center">Record<br />Without</th>
                        <th class="text-center">Amt Won</th>
                        <th class="text-center">Joined</th>
                        <th class="text-center">Left</th>
                </tr>`

            const categories = [sixesChecked, hlChecked, plChecked].map(element => {
                return {
                    checked: element.checked,
                    type: element.value
                }
            });

            const categoryCheck = categories.every(category => category.checked === false);
            if (categoryCheck) return log.innerText = `${id} failed: No checkboxes are checked.`;

            for (const selectedCategory of categories) {
                if (!selectedCategory.checked) continue;
                const filteredExperience = res.experience.filter(division => division.category === selectedCategory.type);
                filteredExperience.map(season => {
                    return table += `<tr> 
                                    <td class="text-center">
                                        ${season.season}
                                     </td>
                                      <td class="text-center">
                                        ${season.div}
                                     </td>
                                     <td class="text-center">
                                         ${season.team}
                                     </td>
                                     <td class="text-center">
                                         ${season.endRank}
                                     </td>
                                     <td class="text-center">
                                         ${season.recordWith}
                                     </td>
                                     <td class="text-center">
                                         ${season.recordWithout}
                                     </td>
                                      <td class="text-center">
                                          ${season.amountWon}
                                    </td>
                                    <td class="text-center">
                                        ${season.joined}
                                    </td>
                                     <td class="text-center">
                                         ${season.left}
                                    </td>
                                  </tr>`
                });
            }

            table += `</table>`

            const bans = [];
            for (let banType in res.bans)
                if (res.bans[banType]) bans.push(banType);

            log.innerHTML = `<span class="response flex-container ${bans.join(" ")}"><a href=${idPath} target="_blank">${res.name}</a></span> ${table}`;
        } catch (e) {
            log.innerText = `${id} FAILED - Failed to fetch`;
        }
    })

    await Promise.all(lookUpResults);
    isLoading = false;
})
