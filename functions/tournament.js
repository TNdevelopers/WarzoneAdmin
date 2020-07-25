function getUserFunction(data) {
    fetch('http://fruitionsoft.tech/warzone/admintournament.php',{
        method:'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(responseJson => {
        global.tournament = responseJson;
        global.ongoing = responseJson.filter(x => x.status === 'Ongoing')
        global.upcoming = responseJson.filter(x => x.status === 'Active')
        global.finished = responseJson.filter(x => x.status === 'Finished')
        data(responseJson)
    })
    .catch(error => console.log(error))
}

export default getUserFunction;