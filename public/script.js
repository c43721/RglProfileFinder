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
        console.log(ids);

        const lookup = await Promise.all(ids.map(async id => {
            const log = document.getElementById("results").appendChild(document.createElement("p"))
            log.innerText = `${id} searching...`

            let idPath
            try {
                let res = await fetch(corsfuck + apiPath + `${id}`)
                res = await res.json()
                
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
                

                let bpv = [];
                if (res.banned) bpv.push("Banned")
                if (res.probation) bpv.push("Probation")
                if (res.verified) bpv.push("Verified")

                if (!res.success) {
                    log.innerText = `${id} failed: ${res.error}`;
                    return "";
                }

                log.innerHTML = `<a href=${idPath} target="_blank">RGL Profile</a>
            ${res.name}
            ${bpv.join(", ")}
            ${table}
            
            `
            } catch (e) {
                log.innerText = `${id} FAILED- Failed to fetch`
            }

            return id;
        }))

        lookup;
        isLoading = false;

        // await fetch(`payload.tf/api/rgl/${id}`)
    })
})();

// 76561198013620065
// 76561198070197879
// 76561198032537855
// 76561198118228294

