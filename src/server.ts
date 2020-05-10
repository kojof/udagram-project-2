import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Request, Response } from 'express';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


   // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
   app.get( "/filteredimage", async ( req: Request, res: Response ) => {

    let photo: string;
    const image_url: string = req.query.image_url;

    // validate  image_url query
    if (!image_url) {
      return res.status(400).send({ message: "Image url is malformed or required" });
    }

    // call filterImageFromURL(image_url) to filter the image
    try
     {
       photo = await filterImageFromURL(image_url);   

      if(!photo) 
      {
          return res.status(500).send({ message: "photo cannot be loaded"});
      }    
      
      // send the resulting file in the response
      res.status(200).sendFile(photo);
    } 
    
    catch(e) 
    {
      res.status(422).send({ message: "Check if image url points to valid file." });
    }
  });

  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();