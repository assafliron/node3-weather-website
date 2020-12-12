const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// define paths for express config
const publicDirectoryPath = express.static(path.join(__dirname,'../public'))
const viewsPath=path.join(__dirname,'../templates/views' )
const partialsPath = path.join(__dirname,'../templates/partials')

//setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(publicDirectoryPath)

app.get('',(req,res)=>{
    res.render('index',{
        title: 'weather',
        name: 'Assaf Liron'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title: 'about me',
        name: 'Assaf Liron'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        helpText: 'Can i offer you this help?',
        title: 'help',
        name: 'Assaf Liron'
    })
})


 
app.get('/weather',(req,res)=>{
    if(!req.query.address){
        return res.send({
            error: 'Adress must be provided'
        })
    }
    geocode(req.query.address,(error,{latitude,longtitude,location}={})=>{
        if(error)
        {
            return res.send({error})
        }

        forecast(latitude, longtitude, (error, forecastData) => {
            if(error)
            {
                return res.send({error})

            }

            res.send({
                location,
                forecast: forecastData,
                address: req.query.address
            })
        })
    })

    
})



app.get('/help/*',(req,res)=>{
    res.render('404',{
        title: 'help error page',
        name: 'Assaf Liron',
        errorText: '404: Help article was not found'
    })
})

app.get('*',(req,res)=>{
    res.render('404',{
        title: 'help error page',
        name: 'Assaf Liron',
        errorText: '404: page not found'
    })
})

app.listen(port,()=>{
    console.log('Server is up on port '+port+'.')
})