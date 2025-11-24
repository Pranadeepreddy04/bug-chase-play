import React, {useState} from 'react';
import { Card, CardHeader} from "@/components/ui/card";
import { CardBody } from 'react-bootstrap';


// params will be cardName and cardData (let's look at other componenets to see structure)
const ProfileStatCard = ({cardName, cardData}) => {

    // for the variables in here, we mainly just need the onhover toggle...
    const [subCardHovered, setSubCardHovered] = useState(false);

    return (
        <>
        <div onMouseEnter={() => setSubCardHovered(true)} 
            onMouseLeave={() => setSubCardHovered(false)}>
              {/* New style 11-22: different shades of gray - maybe we actually want it to LIGHT up (light gray) when we click on it*/}
              <Card style = {{color: 'black', backgroundColor : subCardHovered ? 'lightGray' : 'gray', textAlign : 'left',
              }}>
              <CardHeader>
                <b>{cardName}</b>
              </CardHeader>
              <CardBody>
                <p>&emsp; {cardData}</p>
              </CardBody>
              </Card>
        </div>
        </>
    )
}

export default ProfileStatCard;