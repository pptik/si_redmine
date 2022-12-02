const express = require('express');
const expressLayouts = require('express-ejs-layouts'); 
const Login = require('./model/login')
const Project = require('./model/project')
const Issue = require('./model/issue')
const app = express();
const port = 5000;

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set("layout extractScripts", true)
app.use(express.static('public'))


app.get('/', async (req, res) => {
  const login_all= await Login.getAll()
  const project_all= await Project.getAll()
  const issue_all= await Issue.getAll()
  const page='home'
  res.render('home', {
    layout:'main-layout',
    title: 'Home',
    login_all,
    project_all,
    issue_all,
    page
  },)
})

app.get('/loginlog', async (req, res) => {
  const tahun = new Date().getFullYear()
  const bulan = new Date().getMonth() + 1
  const login_monthly= await Login.groupByMonth(tahun)
  const login_daily= await Login.groupByDay(tahun, bulan)
  const login_user= await Login.groupByUser(tahun, bulan)
  const all_login = await Login.allMonth()
  const page='login'
  // console.log(all_login)
res.render('loginlog',{ 
  layout:'main-layout',
  title: "Login Logs",
  login_monthly,
  login_daily,
  login_user,
  all_login,
  page,
  tahun, bulan
})
})

app.get('/loginlog/:tahun/:bulan', async (req, res) => {
  const bulan = req.params.bulan
  const tahun = req.params.tahun
  const login_monthly= await Login.groupByMonth(tahun)
  const login_daily= await Login.groupByDay(tahun, bulan)
  const login_user= await Login.groupByUser(tahun, bulan)
  const all_login = await Login.allMonth()
  const page='login'
  console.log(login_user)
res.render('loginlog',{
  layout:'main-layout',
  title: "Login Logs",
  login_monthly,
  login_daily,
  login_user,
  all_login,
  page,
  tahun, bulan
})
})

app.get('/projectlog', async (req, res) => {
  const project_monthly= await Project.groupByProject()
  const project_all = await Project.allProject()
  const page='project'
  console.log(project_all)
res.render('projectlog',{
  layout:'main-layout',
  title: "Project Logs",
  project_monthly,
  project_all,
  page
  // login_daily,
  // login_user
})
})


app.get('/issuelog/:id_project', async (req, res) => {
  const id_project = req.params.id_project
  const issue_by_project= await Issue.groupByProject(id_project)
  const page = 'issue'
  // res.send(issue_by_project)

  res.render('issuelog',{
    layout:'main-layout',
    title: "Issue Logs",
    issue_by_project,
    page
})
})


app.get('/issuelog', async (req, res) => {
  const all_issue= await Issue.groupByIssue()
  // const project_daily= await Login.groupByDay()
  // const login_user= await Login.groupByUser()
  const page='issue'
  // console.log(all_issue)
res.render('issuelogall',{
  layout:'main-layout',
  title: "Issue Logs",
  all_issue,
  page
  // login_daily,
  // login_user
})
})


app.get('/home', async (req, res) => {
  const login_all= await Login.getAll()
  const project_all= await Project.getAll()
  const issue_all= await Issue.getAll()
//   res.sendFile('./views/login.html', {root:__dirname});
res.render('home',{
  login_all,
  project_all,
  issue_all,
})
})



app.use('/', (req, res)=>{
    res.status(404);
    res.send('Tidak ditemukan cuy');

});


app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})


// 