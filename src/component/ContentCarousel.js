import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Imgbg from "../img/cool-background.png";
const ContentCarousel = ({ id, title, content }) => {
  return (

      <Carousel.Item interval={1000}>
        <img className="d-block w-100" height={300} src={Imgbg} alt={title} />
        <Carousel.Caption>
          <h3>{title}</h3>
          <p>{content}</p>
        </Carousel.Caption>
      </Carousel.Item>

  );
};

export default ContentCarousel;
