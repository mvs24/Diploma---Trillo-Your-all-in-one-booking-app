import React from 'react';
import './NotFound.css';
import Button from '../../shared/components/Button/Button';

export default (props) => (
  <>
    <div class="page---">
      <div class="content---">
        <h1 className="notFoundHeading">404</h1>
        <h2>Page not found</h2>
        <p>I tried to catch some fog, but i mist</p>
        <Button type="pink" clicked={() => props.history.push('/')}>
          Back to Home
        </Button>
      </div>
      <img className="img---" src="http://www.supah.it/dribbble/008/008.jpg" />
    </div>
  </>
);
