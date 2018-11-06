import React from 'react';
import { Link } from 'react-router-dom';
import { AutoRotatingCarousel, Slide } from 'material-auto-rotating-carousel';



const items = [
  {
    src: './pictures/project1.jpg',
    altText: 'project1',
    captionHeader: 'BermudZer : pricing d’options bermudéennes',
    caption: 'Projet d’Innovation Industrielle de 5ème année, Majeure Ingénierie Financière 2014-2015',
    link:'https://www.esilv.fr/portfolios/bermudzer-pricing-doption-bermudeennes/'
  },
  {
    src: './pictures/project2.jpg',
    altText: 'project2',
    captionHeader: 'Vinci Eco Drive – Conception et pilotage du Bloc moteur, Shell Eco-Marathon 2015',
    caption: 'Projet d’Innovation Industrielle de 5ème année, Majeure Mécanique numérique et modélisation 2014-2015',
    link:'https://www.esilv.fr/portfolios/vinci-eco-drive-conception-et-pilotage-du-bloc-moteur-shell-eco-marathon-2015/'
  },
  {
    src: './pictures/project3.jpg',
    altText: 'Project3',
    captionHeader: 'ID-cam : accessibilité numérique pour les non-voyants et mal-voyants',
    caption: 'Projet 2017-2018 de 5e année du cursus d’élève ingénieur de l’ESILV, promo 2018',
    link:'https://www.esilv.fr/portfolios/id-cam-accessibilite-numerique-non-voyants-mal-voyants/'
  },
  {
    src: './pictures/project4.jpg',
    altText: 'Project4',
    captionHeader: 'Analyse Big Data des sites Unesco via les réseaux sociaux',
    caption: 'Projet d’Innovation Industrielle de 5ème année, Majeure Informatique et sciences du numérique 2014-2015',
    link:'https://www.esilv.fr/portfolios/analyse-big-data-des-sites-unesco-via-les-reseaux-sociaux/'
  }
];

const styles = {
  carousel: {
    position: "relative",
  }
}

console.log("Passed");
export default class Caroussel extends React.Component {


  render() {
    const lng = this.props.lng;
    const slides = items.map((item) => {
      return (
        <a href ='' onClick={() => window.location.href=item.link} >
          <Slide lng={lng}
            media={<img src={item.src} />}
            title={item.captionHeader}
            subtitle={item.caption}
            key={item.src} />
        </a>
      );
    });

    return (
      <div>
        <AutoRotatingCarousel mobile={true} style={styles.carousel} open>
          {slides}
        </AutoRotatingCarousel>
      </div>
    )
  }

}
