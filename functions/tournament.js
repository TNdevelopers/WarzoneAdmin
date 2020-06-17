function getUserFunction() {
    fetch('http://tndevelopersbackend.000webhostapp.com/warzone/admintournament.php',{
        method:'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(responseJson => {
        global.tournament = responseJson;
        global.ongoing = responseJson.filter(x => x.status === 'Active')
        global.upcoming = responseJson.filter(x => x.status === 'Active')
        global.finished = responseJson.filter(x => x.status === 'Active')
    })
    .catch(error => console.log(error))
}

export default getUserFunction;