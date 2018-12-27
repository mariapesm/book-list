import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NavContainer, Home, About, BrowseContainer, ProfileContainer, AccountContainer, PageNotFound, Footer } from './components';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app-root">
          <NavContainer />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/about' component={About} />
            <Route path='/browse' component={BrowseContainer} />
            <Route path='/profile' component={ProfileContainer} />
            <Route path='/:actionType(signup|login|logout)' component={AccountContainer} />
            <Route component={PageNotFound} />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
