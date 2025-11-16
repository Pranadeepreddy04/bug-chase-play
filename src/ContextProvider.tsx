// we need to import react, the context, and the component we want to provide it to (index tsx)
import React, {useState} from 'react';
// ok, starting to get the hang of things...we are importing the whole page from the directory

// now... we also need to provide the context to header
import Header from '@/components/ui/header';
import Index from './pages/Index';

// * we also need the VALUE OF THE CONTEXT

export const MyContext = React.createContext([]);

const ContextProvider = () => {

// still not sure: how is this value getting set way out here?? (oh, by useState)
  const [profileButtonClicked, setProfileButtonClicked] = useState(false); 

  // but how do we actually put multiple pages in here?
  return (
    <MyContext.Provider value={[profileButtonClicked, setProfileButtonClicked]}>
        <Header/>
        <Index/>
    </MyContext.Provider>
  )
};

export default ContextProvider;