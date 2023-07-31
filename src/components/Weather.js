import React from 'react'
import { Card } from 'semantic-ui-react'
import moment from 'moment';

const Weather = ({ weatherData }) => {
    return (
        <Card>
            <Card.Content>
                <Card.Header className="header">{weatherData.name}</Card.Header>
                <p>Temprature: {weatherData.main.temp} &deg;C</p>
                <p>Sunrise: {weatherData.sys.sunrise}</p>
                <p>Sunset: {weatherData.sys.sunset}</p>
                <p>Description: {weatherData.weather[0].description}</p>
                <p>Day: {moment().format('dddd')}</p>
                <p>Date: {moment().format('LL')}</p>
            </Card.Content>
        </Card>
    )
}

export default Weather
