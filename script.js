const inputElement = document.getElementById("input");
const errorElement = document.getElementById("error");
const searchBtn = document.getElementById("submit");
const results = document.getElementById("results");
const apiPath = `https://rgl.payload.tf/api/v1/profiles/`;
// const apiPath = `http://localhost:8080/api/v1/profiles/`; 
const re = /(765611\d+)|(STEAM_[01]\:[01]\:\d+)|(\[U\:[01]\:\d+\])/gi;

const sixesChecked = document.getElementById("6s-check");
const hlChecked = document.getElementById("hl-check");
const plChecked = document.getElementById("pl-check");

let isLoading = false;

searchBtn.addEventListener("click", async () => {
    errorElement.innerText = "";
    results.innerText = "";

    const ids = [...inputElement.value.matchAll(re) || []].map(match => match[0]);
    isLoading = true;
    if (ids.length == 0) errorElement.innerText = `Need at least 1 ID to continue!`;

    const categories = [sixesChecked, hlChecked, plChecked].map(element => {
        return {
            checked: element.checked,
            type: element.value
        }
    });

    const hasCategory = categories.some(category => category.checked === true);
    if (!hasCategory) return log.innerText = `${id} failed: No checkboxes are checked.`;

    const lookUpResults = ids.map(async id => {
        const log = document.getElementById("results").appendChild(document.createElement("div"));

        try {
            log.innerText = `${id} searching...`;

            const response = await fetch(apiPath + id + '?formats=' + categories.filter(c => c.checked).map(c => c.type).join(", "))

            if (!response.ok) {
                const { error } = await response.json();
                return log.innerText = `${id} failed: ${error}`;
            }

            const  { data: { experience, ...profile} } = await response.json();

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

            experience.map(season => {
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
                                    ${season.recordWithout ?? "-"}
                                </td>
                                <td class="text-center">
                                    ${season.amountWon ?? "0"}
                                </td>
                                <td class="text-center">
                                    ${new Date(season.joined).toLocaleDateString("en-US")}
                                </td>
                                <td class="text-center">
                                    ${new Date(season.left).toLocaleDateString("en-US")}
                                </td>
                                </tr>`
            });

            table += `</table>`

            const bans = [];
            for (const banType in profile.status)
                if (profile.status[banType]) bans.push(banType);

            log.innerHTML = `<span class="response flex-container ${bans.join(" ")}"><a href=${profile.link} target="_blank">${profile.name}</a></span> ${table}`;
        } catch (e) {
            log.innerText = `${id} FAILED - Failed to fetch`;
        }
    })

    await Promise.all(lookUpResults);
    isLoading = false;
})
