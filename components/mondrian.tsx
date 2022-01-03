import { NoEthereumProviderError } from "@web3-react/injected-connector";
import React from "react";


interface iProp {}
interface iRect
{
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
}

class Rectangle extends React.Component< iRect>
{
    x:number = 0;
    y:number = 0;
    width:number = 0;
    height:number = 0;
    fill:string ="";

    constructor(props)
    {
        super(props);
        this.state = {
            x: this.props.x,
            y: this.props.y,
            width: this.props.width,
            height: this.props.height,
            fill: this.props.fill
        }
        this.x = props.x;
        this.y = props.y;
        this.width = props.width;
        this.height = props.height;
        this.fill = props.fill;
    }
}

interface MondrianProps
{
    width: number;
    height: number;
    cycles: number;
}

class Mondrian extends React.Component<MondrianProps>  {
    
    constructor (props)    
    {
        super(props);
    }

    render() {
        
        return this.generateSVG();
    }

    getRandomBetween(min: number, max: number)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    getRandom(max:number) {
        return Math.floor(Math.random() * max);
    }

    generateSVG(){    
        
        const colors = ['red', 'red', 'blue', 'blue', 'yellow', 'yellow', 'white', 'white', 'white', 'black']        
        const canvas_width = this.props.width;
        const canvas_height = this.props.height;
        const cycles = this.props.cycles;
        const tolerance = 30; 
        let rectangles:Rectangle[] = [];
    
        
        let counter = 0;
        let availableRect:Rectangle = new Rectangle( {x:0, y:0, width: canvas_width, height:canvas_height, fill: "white" } );
        let newRect:Rectangle;
        
        let parts = 10;
        let nominator = 3;
        let probability = 0.5;

        rectangles.push(availableRect);

        
        
        while (counter < cycles && (availableRect.width > tolerance && availableRect.height > tolerance))
        {
            counter++;
                
            let fraction = this.getRandomBetween(1,nominator);
            
            let newColor = colors[this.getRandom(colors.length)];                  
            while (newColor == availableRect.fill )
                newColor = colors[this.getRandom(colors.length)];                  
            
            if(Math.random() > probability) //Vertical 
            {
                probability += 0.2;
                let new_width = (canvas_width * fraction) / parts;
                while(new_width > availableRect.width)
                {
                    fraction = this.getRandomBetween(1,nominator);
                    new_width = (canvas_width * fraction) / parts;
                }

                let newX = availableRect.x;
                let deltaX = availableRect.x + new_width;
                if(counter % 2 === 0){
                    newX = availableRect.width + availableRect.x - new_width;
                    deltaX = availableRect.x = availableRect.x;
                }

                newRect = new Rectangle ({x: newX, y: availableRect.y, width: new_width, height: availableRect.height, fill: newColor} );
                rectangles.push(newRect);
                availableRect = new Rectangle( {x: deltaX, y: availableRect.y, width: availableRect.width - newRect.width, height: availableRect.height, fill: newRect.fill} );
            }
            else
            {
                probability -= 0.2;
                let new_height = (canvas_height * fraction) / parts;
                while(new_height > availableRect.height)
                {
                    fraction = this.getRandomBetween(1,nominator);
                    new_height = (canvas_height * fraction) / parts;
                }        


                let newY = availableRect.y;
                let deltaY = availableRect.y + new_height;
                if(counter % 2 === 0){              
                    newY = availableRect.height + availableRect.y - new_height;
                    deltaY = availableRect.y = availableRect.y;
                }

                newRect = new Rectangle ({x: availableRect.x, y: newY, width: availableRect.width, height: new_height, fill: newColor});
                rectangles.push(newRect);
                availableRect = new Rectangle ({x: availableRect.x, y: deltaY, width: availableRect.width, height: availableRect.height-new_height, fill: newRect.fill});
            }
            
        }     
        
        return(
            <svg>
            {
            rectangles.map( (rectangle, index) => {
                return (<rect 
                    key={index} 
                    x={rectangle.x}
                    y={rectangle.y}
                    width={rectangle.width}
                    height={rectangle.height}
                    fill={rectangle.fill}
                    strokeWidth={6}
                    stroke="black"
                    />);
                }
            )
            }
            </svg>
        );
    }
}



export { Mondrian };
