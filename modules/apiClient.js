export async function callAPI(accessToken, dpopProof) {
    var url = "https://localhost:44358/DPoP";
    var response = await fetch(url, {
            method: 'GET',
            headers: {
                'DPOP': dpopProof,
                'Authorization': `DPOP ${accessToken}`,
                'Content-Type': 'application/json'
            },            
        })
        .then(response => {
            var json = response.json();            
            return json;
        })
        .then(json => {
            console.log(json);
            return json;
        })
        .catch(function(err){
            console.error(err);
        });
        return response;
}