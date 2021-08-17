export async function callAPI(accessToken, dpopProof, resourceUrl) {    
    var response = await fetch(resourceUrl, {
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
        .catch(function(err){
            console.error(err);
        });
        return response;
}