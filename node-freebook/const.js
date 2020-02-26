const env = require('env')
let resUrl 
if(env === 'dev'){
    resUrl = 'http://192.168.0.106:8081'
}else if(env === 'prood'){
    resUrl = 'http://47.108.181.140'
}

const category=[
    'Biomedicine',
    'BusinessandManagement',
    'ComputerScience',
    'EarthSciences',
    'Economics',
    'Education',
    'Engineering',
    'Environment', 
    'Geography',
    'History',
    'Laws',
    'LifeSciences',
    'Literature',
    'MaterialsScience',
    'Mathematics',
    'MedicineAndPublicHealth',
    'Philosophy',
    'Physics',
    'PoliticalScienceAndInternationalRelations',
    'Psychology',
    'SocialSciences',
    'Statistics'
]

module.exports={
    resUrl,
    category
}