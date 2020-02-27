const env = require('./env')
let resUrl 
let dbHost 
let dbUser 
let dbPwd
if(env === 'dev'){
    resUrl = 'http://192.168.0.106:8081'
    dbHost ='localhost'
    dbUser = 'root'
    dbPwd  = ''
}else if(env === 'prod'){
    resUrl = 'http://47.108.181.140'
    dbHost ='47.108.181.140'
    dbUser ='root'
    dbPwd = ''
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
    category,
    dbHost,
    dbUser,
    dbPwd
}