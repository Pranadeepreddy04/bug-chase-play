import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Trophy, Code, Bug, Shield, Zap, Users} from "lucide-react";
import Header from "@/components/ui/header";




// tring to do some bootstrap imports
/// note: we might have to import a container into here as well?
// ok: we want to keep the THREE things that we want to import

import {Container, Row, Col} from 'react-bootstrap';


const Index = () => {
  return (
    <>

    <div className="min-h-screen bg-background relative">
      <Header />

      {/* <body>
        <h1>Main Content Area</h1>
        <iframe src="subscreen.html" width="800" height="600" frameborder="0"></iframe>
      </body> */}

      {/* Card for the menu dropdown:
      should be conditional on a user being signed-in
      should be a large on-click over the USER selection
      let's base it on the potluck app
      */}

      {/* TODO:
      - change the position of the card (to the right almost all the way)
      -- maybe need to make another DIV encapsulating the whole card
      - make the buttons vertical (might have to put in some kind of container)
      */}

      {/* Issue: this pixel amount prevents DYNAMIC movement*/}
      <div>
          {/* We also want to set the size of the card */}
          <Card style = {{backgroundColor: 'blue', width: '300px', height : '300px',
            position: 'relative', left: '900px', top: '100px'
          }}>

              {/*Note: we will eventually remove this */}
              {/*<CardHeader>
                <CardTitle className="text-xl">Test profile dropdown</CardTitle>
              </CardHeader>*/}

              <CardContent className="profile-card-content">

                {/* We need buttons for: profile, settings */}
                {/* **The buttons need to be placed VERTICALLY on top of one-another 
                for this...we need a column with rows
                */}

              <Container>
                <Col>
                  <Row>
                     <Button size="sm" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 gap-2">
                        <Zap className="h-5 w-5" />
                        Profile
                      </Button>
                  </Row>
                  <Row>
                      <Button size="sm" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 gap-2">
                        <Zap className="h-5 w-5" />
                        Settings
                      </Button>
                  </Row>
                </Col>
              </Container>
              

             
              
                
              </CardContent>

        </Card>
      </div>



      
      




      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Trophy className="h-12 w-12 text-primary animate-glow" />
            <h1 className="text-6xl font-bold text-glow">Test Duel</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The ultimate competitive programming game where testing skills determine victory. 
            Can you catch the bugs or create the perfect trap?
          </p>



          
          <div className="flex gap-4 justify-center">
            <Link to="/duel">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 gap-2">
                <Zap className="h-5 w-5" />
                Start Duel
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2">
              <Users className="h-5 w-5" />
              How to Play
            </Button>
          </div>
        </div>
      </section>

      {/* Game Overview */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How Test Duel Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-gradient-card border-primary/20 shadow-card text-center p-6">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">The Tester</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Player 1 creates the initial program and test suite, then writes new tests to catch bugs introduced by the saboteur.
                </p>
                <Badge className="mt-4 bg-primary/20 text-primary border-primary/30">Defensive Role</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-accent/20 shadow-card text-center p-6">
              <CardHeader>
                <Bug className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-xl">The Saboteur</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Player 2 introduces subtle bugs into the code that existing tests won't catch, trying to create undetectable flaws.
                </p>
                <Badge className="mt-4 bg-accent/20 text-accent border-accent/30">Offensive Role</Badge>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-warning/20 shadow-card text-center p-6">
              <CardHeader>
                <Trophy className="h-12 w-12 text-warning mx-auto mb-4" />
                <CardTitle className="text-xl">Victory Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Win by catching all bugs as the Tester, or by creating undetectable bugs as the Saboteur. Best of 5 rounds!
                </p>
                <Badge className="mt-4 bg-warning/20 text-warning border-warning/30">Competitive</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-card/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Game Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-lg bg-gradient-card border border-primary/20">
              <Code className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Code Editor</h3>
              <p className="text-sm text-muted-foreground">Professional Monaco editor with syntax highlighting</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-card border border-primary/20">
              <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Real-time Testing</h3>
              <p className="text-sm text-muted-foreground">Instant test execution and results</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-card border border-primary/20">
              <Trophy className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Scoring System</h3>
              <p className="text-sm text-muted-foreground">Track wins and competitive rankings</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-card border border-primary/20">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Educational</h3>
              <p className="text-sm text-muted-foreground">Learn testing best practices through play</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-glow">Ready to Duel?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Challenge your testing skills in this unique competitive programming experience. 
            Every bug is a puzzle, every test is a strategy.
          </p>
          
          <Link to="/duel">
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 gap-2">
              <Zap className="h-5 w-5" />
              Start Your First Duel
            </Button>
          </Link>
        </div>
      </section>
    </div>

    </>
  );
};

export default Index;
