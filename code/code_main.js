var container = document.getElementById("container")
var lim = 1000
var select = 1000
var left=0
var from = true;
var to = true;
var draw;
document.addEventListener('contextmenu', event => event.preventDefault())
document.addEventListener("mousedown",(e)=>
{
    e.preventDefault()
    left=e.buttons
})
document.addEventListener("mouseup",(e)=>
{
    left=0
})
function f_resize()
{
    container.style.width = container.offsetHeight+"px";
    draw.style.width = (container.offsetHeight-10)+"px"
    draw.style.height = (container.offsetHeight-10)+"px"
}
// biến quản lý so luong Ô
var Size = 20 // mặc định là 20px
var map = new Array()
class Node
{
    constructor(element)
    {
        this.back
        this.e = element
    } 
    isblock()
    {
        if(this.e.classList.contains("light"))
            return true;
        else
            return false;
    }
    isStatus()
    {
        if(this.e.classList.contains("from"))
        {
            return "from"
        }else
        if(this.e.classList.contains("to"))
        {
            return "to"
        }
        else
            return "";
    }
    get_g()
    {
        let tmp = this.e.id.split("_")
        let x = parseInt(tmp[1])
        let y = parseInt(tmp[2])
        let a = x-cell_from[0]
        let b = y-cell_from[1]
        return Math.sqrt(a*a+b*b)
    }
    get_h()
    {
        let tmp = this.e.id.split("_")
        let x = parseInt(tmp[1])
        let y = parseInt(tmp[2])
        let a = x-cell_to[0]
        let b = y-cell_to[1]
        return Math.sqrt(a*a+b*b)
    }
    get_f()
    {
        return this.get_h()+this.get_g()
    }
}
var node_from
var node_to
function create_map(size) //hàm tạo map
{
    Size = size;
    let sml = ""
    map = new Array();
    for(let y=0;y<size;y++)
    {
        map.push(new Array())
        for(let x=0;x<size;x++)
        {
            sml+='<div class="containCell" style="width: '+(100/Size)+'%;height: '+(100/Size)+'%;">'
            sml+=   '<div id="_'+x+'_'+y+'" class="Cell" onmouseleave=mousel("_'+x+'_'+y+'") onmouseenter=mousel("_'+x+'_'+y+'") onclick=clickon("_'+x+'_'+y+'")></div>'
            sml+='</div>'
            map[y].push(new Object())
        }
    }
    container.innerHTML = sml+'<canvas id="draw"></canvas>';
    for(y=0;y<size;y++)
    for(x=0;x<size;x++)
        map[x][y] = new Node(document.getElementById("_"+x+"_"+y))
    from=true;
    to=true;
    draw = document.getElementById("draw")
    draw.width = container.offsetHeight-10
    draw.height = draw.width
} 
function clickon(id_div)
{ 
    data = id_div.split('_')
    x = data[1]
    y = data[2]
    if(select == lim )
    {
        if(!document.getElementById(id_div).classList.contains('to')&& !document.getElementById(id_div).classList.contains('from'))
        if(!document.getElementById(id_div).classList.contains('light'))
        {
            document.getElementById(id_div).classList.add('light')
            
        }  
        else
        {
            document.getElementById(id_div).classList.remove('light')
        }
    }
    else
    if(select == "from" )
    {
        if(!document.getElementById(id_div).classList.contains('to')&& !document.getElementById(id_div).classList.contains('light'))
        if(!document.getElementById(id_div).classList.contains('from') )
        {
            if(from)
            {
                document.getElementById(id_div).classList.add('from')
                from = false
                cell_from =[x,y]
                node_from = new Node(document.getElementById(id_div))
            }
        }
        else
        {
            document.getElementById(id_div).classList.remove('from')
            from = true
            cell_from =[-1,-1]
            node_from = undefined
        }
    }
    else
    if(select == "to" )
    {
        if(!document.getElementById(id_div).classList.contains('from')&& !document.getElementById(id_div).classList.contains('light'))
        if(!document.getElementById(id_div).classList.contains('to'))
        {
            if(to)
            {
                document.getElementById(id_div).classList.add('to')
                to = false
                cell_to = [x,y]
                node_to = new Node(document.getElementById(id_div))
            }
        }
        else
        {
            document.getElementById(id_div).classList.remove('to')
            to = true
            cell_to = [-1,-1]
            node_to = undefined
        }
    }
}
function mousel(id_div)
{
    //show()
    if(select == lim && left==1)
    {
        document.getElementById(id_div).classList.add('light')
    }
    if(select == lim && left==2)
    {
        document.getElementById(id_div).classList.remove('light')
    }
}
function getText()
{
    s=""
    for(let y=0;y<Size;y++)
    for(let x=0;x<Size;x++)
    {
        let value = ''
        if(document.getElementById("_"+x+"_"+y).classList.contains("light"))
        value=1
        if(document.getElementById("_"+x+"_"+y).classList.contains("to"))
        value=2
        if(document.getElementById("_"+x+"_"+y).classList.contains("from"))
        value=3
        s += value+","
    }
    console.log(s);
}
function setText(str)
{
    s = str.split(",");
    sl=0
    Size = Math.sqrt(s.length-1)
    create_map(Size)
    for(let y=0;y<Size;y++)
    for(let x=0;x<Size;x++)
    {
        let data = s[sl++]       
        if(data=='1')
        {
            document.getElementById("_"+x+"_"+y).classList.add('light')
        }
        if(data=='2')
        {
            document.getElementById("_"+x+"_"+y).classList.add('to')
            to=false
            cell_to= [x,y]
            node_to = new Node(document.getElementById("_"+x+"_"+y))
        }
        if(data=='3')
        {
            document.getElementById("_"+x+"_"+y).classList.add('from')
            from=false
            cell_from = [x,y]
            node_from = new Node(document.getElementById("_"+x+"_"+y))
        }
    }
    
}
setText("3,,,,,,,,,,,,,,1,,1,,1,1,1,1,1,1,1,1,,1,,,,1,,,,,,,,,,,1,,1,,1,,1,1,1,,1,,,,1,1,,,,1,,1,,1,,,,1,,1,,1,,,1,,1,,1,1,1,,1,,1,,,,,1,,1,,,,,,1,,1,1,1,,,,,,,1,,1,1,1,,1,,,,,,,1,1,1,,1,,,,1,,1,1,,1,,1,,,,,,1,,1,,1,,,1,,1,,,1,1,1,1,,,,1,,,1,,1,,,,,,,,,,,,,1,,,,1,1,1,,1,1,1,,1,1,,1,1,1,1,,,1,,1,,,,1,,,,,,,,,,,1,,1,,,2,")
//setText("3,,,,,,,,,,,1,,,,,,,,,1,,1,1,,,,,,1,,1,,,,,,,,,1,,2,,,,,,,1,,,,,,,,1,1,,,,,,,,,,,,,,,,,,,,,,,")
//setText(",,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,")
function show(type)
{
    for(let y=0;y<Size;y++)
    for(let x=0;x<Size;x++)
    {
        if(type==1) document.getElementById("_"+x+"_"+y).innerHTML = "<p class='nd'>"+(map[x][y].get_f()).toFixed(1)+"</p>"
        if(type==2) document.getElementById("_"+x+"_"+y).innerHTML = "<p class='nd'>"+(map[x][y].get_g()).toFixed(1)+"</p>"
        if(type==3) document.getElementById("_"+x+"_"+y).innerHTML = "<p class='nd'>"+(map[x][y].get_h()).toFixed(1)+"</p>"
    }
}
var open = new Array()
var close = new Array()
function nodemin()
{
    let min = open[0]
    let vt = 0
    let gt = node_from.get_f()
    for(i=1;i<open.length;i++)
    {
        if(Math.abs(gt-open[i].get_f())<Math.abs(gt-min.get_f()))
        {
            min = open[i]
            vt = i ;
        }
    }
    open.splice(vt,1)
    return min
}
function isexist(m,clo)
{
    if(document.getElementById("_"+m[0]+"_"+m[1]).classList.contains("light"))
        return true;
    for(i=0;i<clo.length;i++)
    {
        if(clo[i].e==document.getElementById("_"+m[0]+"_"+m[1]))
        {
            return true
        }
    }
    return false
}
function addnode(min)
{
    let tmp = min.e.id.split("_")
    let x = parseInt(tmp[1])
    let y = parseInt(tmp[2])
    close.push(min)
    if(x+1<Size)
    {
        if(!isexist([x+1,y],close)&&!isexist([x+1,y],open))
        {
            open.push(new Node(document.getElementById("_"+(x+1)+"_"+(y))))
            open[open.length-1].back = min
        }
    }
    if(y+1<Size)
    {
        if(!isexist([x,y+1],close)&&!isexist([x,y+1],open))
        {
            open.push(new Node(document.getElementById("_"+(x)+"_"+(y+1))))
            open[open.length-1].back = min
        }
    }
    if(x-1>=0)
    {
        if(!isexist([x-1,y],close)&&!isexist([x-1,y],open))
        {
            open.push(new Node(document.getElementById("_"+(x-1)+"_"+(y))))
            open[open.length-1].back = min
        }
    }
    if(y-1>=0)
    {
        if(!isexist([x,y-1],close)&&!isexist([x,y-1],open))
        {
            open.push(new Node(document.getElementById("_"+(x)+"_"+(y-1))))
            open[open.length-1].back = min
        }
    }
    if(x-1>=0&&y-1>=0)
    {
        if(!isexist([x-1,y-1],close)&&!isexist([x-1,y-1],open))
        {
            open.push(new Node(document.getElementById("_"+(x-1)+"_"+(y-1))))
            open[open.length-1].back = min
        }
    }
    if(x+1<Size&&y+1<Size)
    {
        if(!isexist([x+1,y+1],close)&&!isexist([x+1,y+1],open))
        {
            open.push(new Node(document.getElementById("_"+(x+1)+"_"+(y+1))))
            open[open.length-1].back = min
        }
    }
    if(x+1<Size&&y-1>=0)
    {
        if(!isexist([x+1,y-1],close)&&!isexist([x+1,y-1],open))
        {
            open.push(new Node(document.getElementById("_"+(x+1)+"_"+(y-1))))
            open[open.length-1].back = min
        }
    }
    if(x-1>=0&&y+1<Size)
    {
        if(!isexist([x-1,y+1],close)&&!isexist([x-1,y+1],open))
        {
            open.push(new Node(document.getElementById("_"+(x-1)+"_"+(y+1))))
            open[open.length-1].back = min
        }
    }
}
function color()
{
   open.forEach(item=>{
       item.e.classList.add("open")
   })
   close.forEach(item=>{
        item.e.classList.add("close")
    })
}
function back(node)
{
    var ctx = draw.getContext("2d")
    ctx.beginPath()
    let x = node.e.offsetLeft+(node.e.offsetWidth/2)
    let y = node.e.offsetTop+(node.e.offsetWidth/2)
    ctx.moveTo(x, y)
    while(true)
    {
        let x1 = node.e.offsetLeft+(node.e.offsetWidth/2)
        let y1 = node.e.offsetTop+(node.e.offsetWidth/2)
       

        ctx.lineTo(x1, y1)
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#c142e0"
        ctx.stroke()
        if(node.back==undefined)
        {
            break;
        }
        node = node.back
    }
    ctx.closePath()
    
}
function run()
{
    open = new Array()
    close = new Array()
    open.push(node_from)
    k = setInterval(e=>{
        let nodenow = nodemin()
        addnode(nodenow)
        if( nodenow.e == node_to.e)
        {
            clearInterval(k)
            back(nodenow)
            return "success";
        }
        color()
    },100)
}

f_resize()
function changeCSS(cssFile, cssLinkIndex) {

    var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", cssFile);

    document.getElementsByTagName("head").item(cssLinkIndex).replaceChild(newlink, oldlink);
}