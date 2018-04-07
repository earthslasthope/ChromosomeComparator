import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import About from './components/About';
import Donate from './components/Donate';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/about' component={About} />
    <Route path='/donate' component={Donate} />
</Layout>;
