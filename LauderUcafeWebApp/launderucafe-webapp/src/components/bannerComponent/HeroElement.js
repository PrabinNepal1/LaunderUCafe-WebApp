import React from 'react'
import LaundryHero from './laundryHero.jpg'
import {Link} from 'react-router-dom';
import { Button } from "react-bootstrap";

export default function HeroElement() {
  return (
    <div className="HeroContainer">
      <div className="HeroBg">
          <img src={LaundryHero} alt="Laundromat"/>
      </div>
      <div className="HeroContent">
          <div className="HeroH1">
            Laundry Made Easy
          </div>
          <div className="HeroP">
            Get you laundry schedule for delivery through us.
            We will handle everything from there.
            Sit back and enjoy your time with your loved ones.
          </div>
            <Button variant="secondary" className="customAddItem mt-2"><Link className="heroLink" to="./laundry">Schedule Laundry</Link></Button>
          <div className="HeroP">
              Have nothing to do while you wait.
              Hang out in our Cafe Section.
          </div>
            <Button className="mt-2" variant="secondary" className="customAddItem mt-2"><Link className="heroLink" to="./cafe">Pick up in Cafe</Link></Button>
      </div>

    </div>
  )
}
