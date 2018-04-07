import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';

const About = () => (<div>
    <h1>About</h1>
    <p>
        This site was created with the goal of aiding in the search of unknown parentage.
        The idea came to fruition as I was personally in search of my sperm donor and lacked these sort of tools.
        Currently it only features a chromosome comparator
        for <a href="http://www.familytreedna.com" target="_blank">Family Tree DNA</a> only. As time allows I may add support for data dumps from other sites.
        To aid the effort of enhancing this tool please consider giving me a <NavLink to={'/donate'}>donation</NavLink> of any size you wish.
    </p>
    <p>
        My philosophy is to avoid any manual tasks which can be automated and to search on DNA websites for common lineages by browsing
        chromosomes is really tedious.
    </p>
    <p>
        If you have any suggestions for how we can improve or any new features that you want please don't hesitate to reach out to me
        at <a href="mailto:thor@runesmith.org">thor@runesmith.org</a>.
    </p>
</div>)

export default About;