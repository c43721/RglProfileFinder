(() => {
    const inputElement = document.getElementById("input");
    const errorElement = document.getElementById("error");
    const searchBtn = document.getElementById("submit");
    const results = document.getElementById("results")
    const corsfuck = `https://cors-anywhere.herokuapp.com/`
    const apiPath = `https://payload.tf/api/rgl/`
    const re = /(765611\d+)|(STEAM_[01]\:[01]\:\d+)|(\[U\:[01]\:\d+\])/gi;

    let isLoading = false;

    inputElement.addEventListener("click", () => {
        errorElement.innerText = "";
        if (results && isLoading === false) results.innerHTML = "";
        else errorElement.innerText = "Please wait for the results to load before clearing."
    })

    searchBtn.addEventListener("click", async ev => {
        errorElement.innerText = "";

        const ids = [...inputElement.value.matchAll(re) || []].map(match => match[0]);
        isLoading = true;
        if (ids.length == 0) errorElement.innerText = `Need at least 1 ID to continue!`

        const lookup = await Promise.all(ids.map(async id => {
            const log = document.getElementById("results").appendChild(document.createElement("p"));

            let idPath
            try {
                log.innerText = `${id} searching...`

                let res = await fetch(corsfuck + apiPath + id)
                res = await res.json()

                if (!res.success) {
                    log.innerText = `${id} failed: ${res.error}`;
                    return "";
                }

                idPath = `https://rgl.gg/Public/PlayerProfile.aspx?p=${res.steamid}`

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

                res.experience.map((obj) => {
                    if (obj.category === "trad. sixes") {
                        return table += `<tr>
                                <td class="text-center">
                                      ${obj.season}
                                 </td>
                                  <td class="text-center">
                                    ${obj.div}
                                 </td>
                                 <td class="text-center">
                                     ${obj.team}
                                 </td>
                                 <td class="text-center">
                                     ${obj.endRank}
                                 </td>
                                 <td class="text-center">
                                     ${obj.recordWith}
                                 </td>
                                 <td class="text-center">
                                     ${obj.recordWithout}
                                 </td>
                                  <td class="text-center">
                                      ${obj.amountWon}
                                </td>
                                <td class="text-center">
                                    ${obj.joined}
                                </td>
                                 <td class="text-center">
                                     ${obj.left}
                                   </td>
                              </tr>`
                    }
                    else return;
                });
                table += `</table>`

                if (res.banned) {
                  log.innerHTML = `<span class="response flex-container banned"><a href=${idPath} target="_blank">${res.name}</a></span>
                  ${table}`
                }
                else if (res.probation) {
                  log.innerHTML = `<span class="response flex-container probation"><a href=${idPath} target="_blank">${res.name}</a></span>
                  ${table}`
                }
                else if (res.verified){
                  log.innerHTML = `<span class="response flex-container verified"><a href=${idPath} target="_blank">${res.name}</a></span>
                  ${table}`
                } else {
                  log.innerHTML = `<span class="response flex-container"><a href=${idPath} target="_blank">${res.name}</a></span>
                  ${table}`
                }
            } catch (e) {
                log.innerText = `${id} FAILED- Failed to fetch`
            }
            return id;
        }))

        lookup;
        isLoading = false;
    })
})();
