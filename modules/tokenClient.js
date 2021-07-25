export async function getAccessToken(url, dpopProof) {

    var result = await fetch(url, {
            method: 'POST',
            headers: {
                'DPOP': dpopProof,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'client_id=client&grant_type=client_credentials'
        })
        .then(response => {
            return response.text();
        })
        .catch(function(error) {
            console.log(error);
        });
    
        var jsonResult = JSON.parse(result);
        var token = jsonResult.access_token;        
        return token;
}