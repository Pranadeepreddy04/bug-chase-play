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
import React, {useState, useEffect} from 'react';

const Profile = () => {

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // let's get the display name (string) from the profiles
    const [displayName, setDisplayName] = useState('');


    // Get initial session (note: we need to do useEffect in order for things not to keeep rendering over and over)
      useEffect(() => {
          // Get initial session
          const initAuth = async () => {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              setUser(session?.user ?? null);
              
              console.log("Successfully retrieved the user");
              console.log(user);


            } catch (error) {
              console.warn('Supabase auth not available:', error);
              setUser(null);
            } finally {
              setIsLoading(false);
            }
          };
          initAuth();
          
        }, []);

        


        // Trying to do a 2nd use-effect with dependencies
        useEffect(() => {
            // we need an async function to do the work
            const fetchFromProfiles = async () => {
              /* const { data, error } = await supabase
              .from('your_table_name')
              .select('*') // Select all columns
              .eq('id', 123) // Filter by a specific ID
              .single(); */

             
              const {data, error } = await supabase
              .from('profiles')
              .select('*') // Select all columns
              .eq('id', user.id) // Filter by a specific ID
              .single();
              // now, we need to do a test print of the data we've received
              console.log("Data from the profiles table: ");
              console.log(data);


              // now that we have this data, let's use it to set the display name...
              setDisplayName(data.display_name);
              

              

              // *after we know we've received it, then we can add it to a data item

            }

            // to get this to work, we need a count query
            const getWinsAsTester = async () => {
              /* const { count, error } = await supabase
  .from('your_table_name')
  .select('*', { count: 'exact', head: true })
  .eq('column_name', 'your_value'); */

                const { count, error } = await supabase
                .from('game_scores')
                .select('*', { count: 'exact', head: true })
                // the where condition for the winner
                .eq('winner', 'tester');

                console.log("Test print - count of the wins as tester")
                console.log(count);

                // LET'S GO!!

              
            }

            const getWinsAsSaboteur = async () => {
            

                const { count, error } = await supabase
                .from('game_scores')
                .select('*', { count: 'exact', head: true })
                // the where condition for the winner
                .eq('winner', 'saboteur');

                console.log("Test print - count of the wins as saboteur")
                console.log(count);

                // LET'S GO!!

              
            }
            // now finally, we just need to get the total number of games played (would it have to be the sum)?

            const getTotalGamesPlayed = async () => {
              const { count, error } = await supabase
                .from('game_scores')
                .select('*', { count: 'exact', head: true})
                // the where condition for the winner

                console.log("Test print - count of TOTAL GAMES FINISHED");
                console.log(count);
                // result: just the same issue
            }

            fetchFromProfiles();
            getWinsAsTester();
            getTotalGamesPlayed();

        // in here, we need to put the user variable as the depdendency
        }, [user])

        


      // Test print of the user we've found
      ////console.log(user.email)

      // test variable for setting the subcards

      const [subCardHovered, setSubCardHovered] = useState(false);


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
          
          {/*Column for personal info (we need text to display on separte rows, one way or another 
          -- let's make it CONDIONAL now
          */}

          {user && (displayName != '')
            ? (<Col>
              {/* Issue: how do we get this name? 
              -- looking in the migrations, we'd need to do a fetch from public.profiles
              */}
              <p>@{displayName}</p>
              <p>{user.email}</p>
              <p>Joined {user.created_at.substring(0, 10)}</p>
              </Col>)
            : (<Col>
            {/*Might need to put a better loading icon here */}
            <p>Loading personal info...</p>
            </Col>)
          }

          

        </Row>

      </Container>

    {/* next thing to try to do: get the background looking good 
    -- **we also need to color the logos/images correctly
    */}
      
      
      {/* 2nd container */}
      <Container>
        {/* Outer card in the 2nd class - we want this to have width 50%*/}
        <Card style = {{width : '50%', height: '50%', textAlign: 'center', backgroundColor : 'rgb(88, 83, 83)'}}>
        <p>Game Stats for {displayName}</p>

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

            {/* Putting a div around the card to do onmouseenter */}
            <div onMouseEnter={() => setSubCardHovered(true)} 
            onMouseLeave={() => setSubCardHovered(false)}>
              <Card className = "profileStatCard" style = {{backgroundColor : subCardHovered ? 'yellow' : 'gray', textAlign : 'left',
              }}>
              <CardHeader>
                <b>Wins as Tester</b>
              </CardHeader>
              <CardBody>
                <p>&emsp; 10</p>
              </CardBody>
              </Card>
            </div>
            
            
            
            
            
            
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