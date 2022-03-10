function getHx(x,y)
{
    a = x-cell_from[0]
    b = y-cell_from[1]
    return Math.sqrt(a*a+b*b)
    return 0
}
function getGx(x,y)
{
    a = x-cell_from[0]
    b = y-cell_from[1]
    return parseFloat(a+b)
}
function GetMap(x,y)
{
    gx = getGx(x,y)
    hx = getHx(x,y)
    try{
        if(document.getElementById("_"+x+"_"+y).classList.contains("light"))
        return null
        else
        return parseFloat(gx+hx)
    }catch{
        console.log("x = "+x+",y = "+y);
    } 
}
function show(type=1)
{
    if(from==false&&to==false)
    for(let y=0;y<Size;y++)
    for(let x=0;x<Size;x++)
    {
        if(type==1)map[x][y] = (getHx(x,y)+getGx(x,y)).toFixed(1)
        if(type==2)map[x][y] = getHx(x,y).toFixed(1)
        if(type==3)map[x][y] = getGx(x,y).toFixed(1)
        document.getElementById("_"+x+"_"+y).innerHTML = "<p class='nd'>"+map[x][y]+"</p>"
    }
}
var open = new Array()//mảng toàn cục chức phần tử open
var close = new Array() //mảng toàn cục chứa các phần close 
function print(m)
{
    return "P("+m[0]+","+m[1]+")"
}
function printArray()
{
    s="open: "
    open.forEach(item=>{
        s+= print(item)+", "
    })
    s+="\nclose: "
    close.forEach(item=>{
        s+= print(item)+", "
    })
    return s
} 
function isexist(m,clo)
{
    for(i=0;i<clo.length;i++)
    {
        if(clo[i][0]==m[0]&&clo[i][1]==m[1])
        {
            return true
        }
    }
    return false
}
function addopen(m)
{
    close.push([m[0],m[1]])
    if(m[0]+1<Size&&GetMap(m[0]+1,m[1])!=null)
    {
        if(!isexist([m[0]+1,m[1]],close)&&!isexist([m[0]+1,m[1]],open))
        {
            open.push([m[0]+1,m[1]])
        }
    }
    if(m[1]+1<Size&&GetMap(m[0],m[1]+1)!=null)
    {
        if(!isexist([m[0],m[1]+1],close)&&!isexist([m[0],m[1]+1],open))
        {
            open.push([m[0],m[1]+1])
        }
    }
    if(m[0]-1>=0&&GetMap(m[0]-1,m[1])!=null)
    {
        if(!isexist([m[0]-1,m[1]],close)&&!isexist([m[0]-1,m[1]],open))
        {
            open.push([m[0]-1,m[1]])
        }
    }
    if(m[1]-1>=0&&GetMap(m[0],m[1]-1)!=null)
    {
        if(!isexist([m[0],m[1]-1],close)&&!isexist([m[0],m[1]-1],open))
        {
            open.push([m[0],m[1]-1])
        }
    }
    if(m[0]-1>=0&&m[1]-1>=0&&GetMap(m[0]-1,m[1]-1)!=null)
    {
        if(!isexist([m[0]-1,m[1]-1],close)&&!isexist([m[0]-1,m[1]-1],open))
        {
            open.push([m[0]-1,m[1]-1])
        }
    }
    if(m[0]+1<Size&&m[1]+1<Size&&GetMap(m[0]+1,m[1]+1)!=null)
    {
        if(!isexist([m[0]+1,m[1]+1],close)&&!isexist([m[0]+1,m[1]+1],open))
        {
            open.push([m[0]+1,m[1]+1])
        }
    }
    if(m[0]+1>=0&&m[1]-1>=0&&GetMap(m[0]+1,m[1]-1)!=null)
    {
        if(!isexist([m[0]+1,m[1]-1],close)&&!isexist([m[0]+1,m[1]-1],open))
        {
            open.push([m[0]+1,m[1]-1])
        }
    }
    if(m[0]-1>=0&&m[1]+1>=0&&GetMap(m[0]-1,m[1]+1)!=null)
    {
        if(!isexist([m[0]-1,m[1]+1],close)&&!isexist([m[0]-1,m[1]+1],open))
        {
            open.push([m[0]-1,m[1]+1])
        }
    }
    vt = 0;
    for(i=0;i<open.length;i++)
    {
        if(open[i][0]==m[0]&&open[i][1]==m[1])
        {
            vt = i;
            break;
        }
    }
    open.splice(vt,1);
   
}
function color()
{
    close.forEach(i=>{
        document.getElementById("_"+i[0]+"_"+i[1]).classList.add("close")
    })
    open.forEach(i=>{
        document.getElementById("_"+i[0]+"_"+i[1]).classList.add("open")
    })
}
function getMinOpen()
{
    min = [open[0][0],open[0][1]]
    for(i=1;i<open.length;i++)
    {
        kc1 = GetMap(min[0],min[1])
        kc2 = GetMap(open[i][0],open[i][1])
        varHx = getHx(cell_to[0],cell_to[1])
        if(Math.abs(varHx - kc1) > Math.abs(varHx -kc2))
        {
            min = [open[i][0],open[i][1]]
        }
    }
    return [parseInt(min[0]),parseInt(min[1])]
}
function run()
{
    open = new Array()
    close = new Array()
    open.push([cell_from[0],cell_from[1]])
    sl = 1
    var a = setInterval(()=>{
            console.log("bước số: "+(sl++))
            min = getMinOpen()
            if(min[0]==cell_to[0]&&min[1]==cell_to[1])
            {
                console.log("Tìm Thấy đường đi");
                clearInterval(a);
            }
            addopen(min)
            console.log(printArray())
            color()
      
    },0)
}
function getRun(buoc)
{
    open = new Array()
    close = new Array()
    open.push([cell_from[0],cell_from[1]])
    sl = 1
    while(true)
    {
        try{
            if(sl==buoc)
            console.log("bước số: "+sl)
            sl++
            min = getMinOpen()
            if(min[0]==cell_to[0]&&min[1]==cell_to[1])
            {
                console.log("Tìm Thấy đường đi");
                break;
            }
            addopen(min)
            if(sl==buoc)
                console.log(printArray())
            if(sl==buoc)
                color()
        }catch{
            console.log("không tìm thấy");
            break;
        }
    }
}