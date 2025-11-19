import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Trophy, UserPlus, Code, Bug, Shield, Zap, Users } from "lucide-react";
import Header from "@/components/ui/header";

// let's get the container stuff from bootstrap
import {Container, Row, Col, CardBody} from 'react-bootstrap';

import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import React, {useState} from 'react';

const Profile = () => {

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get initial session
      const initAuth = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          setUser(session?.user ?? null);
        } catch (error) {
          console.warn('Supabase auth not available:', error);
          setUser(null);
        } finally {
          
        }
      };

      initAuth();

      // Test print of the user we've found
      console.log(user)


  return (

    <>

    {/* Let's try to place everything inside a main div - step by step */}
    {/* Oh, ok maybe the issue was that I had a classname on the container? Now we can just continue working outer to inner on this*/}
    <div className="min-h-screen bg-background relative">
      {/* 1st container */}
      <Container>
        <Row>
          {/* Logo image - reference from header*/}
          
          <Col style = {{display: 'flex'}}>
            {/* Let's try to get this better from the header, but DON'T make it link back yet...*/}
            <Trophy className="h-12 w-12 text-primary"/>
            <span className="text-xl font-bold">Test Duel</span>
          </Col>

          {/* Profile image - reference from header*/}
          <Col>
            <UserPlus className="h-8 w-8" />
          </Col>
          
          {/*Column for personal info (we need text to display on separte rows, one way or another */}
          <Col>
            <p>{user.email}</p>
            <p>Display name</p>
            <p>Created at</p>
          </Col>

        </Row>

      </Container>

    {/* next thing to try to do: get the background looking good 
    -- **we also need to color the logos/images correctly
    */}
      
      
      {/* 2nd container */}
      <Container>
        {/* Outer card in the 2nd class - we want this to have width 50%*/}
        <Card style = {{width : '50%', height: '50%', textAlign: 'center', backgroundColor : 'rgb(88, 83, 83)'}}>
        <p>Game Stats for --User--</p>

          {/*We need 3 sub-cards, each of which having the same style*/}

          {
            /*Style things we may weant to do for these: Color, textcolor...*/
          }

          {/* Issue/TODO: the css sheet is still not working, so I might want to figure that out (for now, I'm just repeating styles in here) */}

          {/*Div for around the inner cards 
          Q: are these widths and height relative to the nearest div?
          A: actually parent element
          But then why isn't it working with respect to the card? (particularly the height isn't)

          width : '90%', height : '20%', 
          */}


          <div style = {{margin: '5% 5%'}}>
            <Card className = "profileStatCard" style = {{backgroundColor : 'gray', textAlign : 'left'}}>
            <CardHeader>
              <b>Wins as Tester</b>
            </CardHeader>
            <CardBody>
              <p>&emsp; 10</p>
            </CardBody>
            
            </Card>
            {/* Issue: can we make another card that has the same classname?? Yes, let's go*/}
            <Card className = "profileStatCard" style = {{backgroundColor : 'gray', textAlign : 'left'}}>
              <CardHeader>
                <b>Wins as Saboteur</b>
              </CardHeader>
              <CardBody>
                <p>&emsp; 10</p>
              </CardBody>
            </Card>

            <Card className = "profileStatCard" style = {{backgroundColor : 'gray', textAlign : 'left'}}>
              <CardHeader>
                <b>Total Number of Games Played</b>
              </CardHeader>
              <CardBody>
                <p>&emsp; 10</p>
              </CardBody>
            </Card>
          </div>
          

          {/* Another potential to-do: make these sub-cards functions, since they keep getting repeated?? */}


        </Card>
      </Container>

      </div>

    </>

  );
}

export default Profile;