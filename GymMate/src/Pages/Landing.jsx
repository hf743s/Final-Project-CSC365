// src/Pages/Landing.jsx
import "./Landing.css"
import {FaDumbbell, FaCalendarAlt, FaStar } from "react-icons/fa"


export default function Landing() {
  return (
    <div className="landing-content">
      {/*HEADER*/}
      <section className="header">
        <div className="wrapper">
          <div className="box">
            <h1>Plan. Track. Become Stronger.</h1>
            <p>Your personalized workout planner to keep you consistent!</p>
          </div>
        </div>
      </section>

      {/*FEATURES*/}
      <section className="features">
        <div className="feature">
          <FaDumbbell className="icon" />
          <h3>Build Workouts</h3>
          <p>Create custom workouts tailored to your goals</p>
        </div>

        <div className="feature">
          <FaCalendarAlt className="icon" />
          <h3>Plan Each Workout</h3>
          <p>Organize your routines with a simple weekly layout</p>
        </div>

        <div className="feature">
          <FaStar className="icon" />
          <h3>Stay Consistent</h3>
          <p>Track your progress and stay motivated</p>
        </div>
      </section>

      {/*HOW IT WORKS*/}
      <section className="how">
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">
            <span className="number">1</span>
            <p>Choose your exercises and create workouts.</p>
          </div>

          <div className="step">
            <span className="number">2</span>
            <p>Start the workout and log as you go.</p>
          </div>

          <div className="step">
            <span className="number">3</span>
            <p>End the workout and your progress is saved!</p>
          </div>
        </div>
      </section>
    </div>
  );
}
