import React, { useState, useEffect } from 'react';
import './App.css';

const api = {
	key: process.env.REACT_APP_WEATHER_API_KEY,
	url: 'https://api.openweathermap.org/data/2.5/',
};

function Greeting(props) {
	const isWeather = props.isWeather;
	console.log(isWeather);
	if (isWeather) {
		return <div className="error404">No details found, Please enter correct city!</div>;
	} else {
		return <div className="error404">Welcome!</div>;
	}
}

const dateBuilder = (d) => {
	let months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	let day = days[d.getDay()];
	let date = d.getDate();
	let month = months[d.getMonth()];
	let year = d.getFullYear();

	return `${day} ${date} ${month} ${year}`;
};

function App() {
	const [query, setQuery] = useState('');
	const [weather, setWeather] = useState('');
	const [quote, setQuote] = useState('');
	const [listOfEvents, setlistOfEvents] = useState('');

	useEffect(() => {
		fetch('https://allevents.s3.amazonaws.com/tests/all.json')
			.then((response) => response.json())
			.then((response) => {
				console.log(response);
				console.log(response.item);
				setlistOfEvents(response.item);
			});
	}, [listOfEvents]);

	const search = (evt) => {
		if (evt.key === 'Enter') {
			fetch(`${api.url}weather?q=${query}&units=metric&APPID=${api.key}`)
				.then((response) => response.json())
				.then((response) => {
					console.log(response);
					setWeather(response);
					setQuery('');
				})
				.catch((err) => {
					console.log(err);
				});

			fetch('https://quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com/quote?token=ipworld.info', {
				method: 'GET',
				headers: {
					'x-rapidapi-host': 'quotes-inspirational-quotes-motivational-quotes.p.rapidapi.com',
					'x-rapidapi-key': process.env.REACT_APP_QUOTE_API_KEY,
				},
			})
				.then((response) => response.json())
				.then((response) => {
					setQuote(response);
					console.log(response);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	return (
		<div className={typeof weather.main != 'undefined' ? (weather.main.temp > 27 ? 'app-warm' : 'app') : 'app'}>
			<main>
				<div className="search-box">
					<input
						type="text"
						className="search-bar"
						placeholder="Search 🔎"
						onChange={(e) => setQuery(e.target.value)}
						value={query}
						onKeyPress={search}
					/>
				</div>
				{typeof weather.main != 'undefined' ? (
					<div className="main-item">
						{/* Weather Information */}
						<div className="weather-content">
							<div className="location-box">
								<div className="location ">
									{weather.name}, {weather.sys.country}{' '}
								</div>
								<div className="date">{dateBuilder(new Date())}</div>
							</div>
							<div className="weather-box">
								<br />
								<div className="temp">{Math.round(weather.main.temp)}°C</div>
								<div className="weather">{weather.weather[0].main}</div>
							</div>
						</div>

						<div className="event-heading">Events</div>
						{/* List of Events  */}
						<div className="event-deck">
							{listOfEvents.map((event) => {
								console.log(event);
								return (
									<div class="event-card">
										<div class="event-image">
											{' '}
											<img src={event.thumb_url_large} alt=" " />{' '}
										</div>
										<div class="about-event title-white">
											<a id="event-links" href={event.event_url} target="_blank" rel="noreferrer">
												<div className="event-details">
													<h4>Event</h4>{' '}
													<h3>
														{event.eventname_raw} <br />
													</h3>
													<br />
													<h5>@{event.venue.full_address}</h5>
													<br />
													<h4>Timings</h4>
													<h5>
														{event.start_time_display} - {event.end_time_display}
													</h5>
													<br />
													<a href={event.tickets.ticket_url} target="_blank" rel="noreferrer">
														<h4>Check for Tickets!</h4>
													</a>
												</div>
											</a>
										</div>
									</div>
								);
							})}
						</div>

						{/* Quote Of The Day  */}
						<div className="daily-quote">
							"{quote.text}" - <i>{quote.author}</i>
						</div>
					</div>
				) : (
					<Greeting isWeather={weather} />
				)}
			</main>
		</div>
	);
}

export default App;
