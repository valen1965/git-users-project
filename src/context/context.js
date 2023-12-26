import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

// Provider, Consumer - GithubContext.Provider

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  //  request loading
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // errors
  const [error, setError] = useState({ show: false, msg: '' });

  const searchGithubUser = async (user) => {
    // toggle error
    toggleError();
    setIsLoading(true);
    const resp = await axios
      .get(`${rootUrl}/users/${user}`)
      .catch((err) => console.log(err));
    // console.log(resp);

    if (resp) {
      setGithubUser(resp.data);
      const { login, followers_url } = resp.data;
      // repos

      await Promise.allSettled([
        axios.get(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios.get(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results;
          const status = 'fulfilled';
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toggleError(true, 'there is no user with that username');
    }
    checkRequests();
    setIsLoading(false);
  };

  // check rate
  const checkRequests = () => {
    axios
      .get(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        const { rate } = data;
        let { remaining } = rate;

        setRequests(remaining);
        if (remaining === 0) {
          // throw an error
          toggleError(true, 'Sorry, you are exceeded your hourly rate limit!');
        }
      })
      .catch((err) => console.log(err));
  };

  //error

  function toggleError(show = false, msg = '') {
    setError({ show, msg });
  }

  useEffect(checkRequests, []);

  // useEffect(() => {
  //   console.log('Hey, App has been loaded');
  // }, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser: githubUser,
        repos: repos,
        followers: followers,
        requests: requests,
        error: error,
        searchGithubUser: searchGithubUser,
        isLoading: isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
