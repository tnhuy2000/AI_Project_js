var container = document.getElementById("container")
var select = 0
var left=0
var from = true;
var to = true;
var draw;
var runauto = false;
var setadd = true;
var cell_from = [-1,-1];
var cell_to = [-1,-1]
var time = document.getElementById("time")
var slbuoc = document.getElementById("buoc")
var them = 1
var xoa = 1
document.addEventListener('contextmenu', event => event.preventDefault())
// biến quản lý so luong Ô
var Size = 15 // mặc định là 20px
var map = new Array()
var node_from
var node_to
function tinhg(n)
{
    let gt =0
    node = new Node(n.e)
    node.back = n.back
    while(node.back != undefined)
    {
        let back = node.back
        let a = node.x() - back.x()
        let b = node.y() - back.y()
        gt += Math.sqrt(a*a+b*b)
        node = back
    }
    return gt
}
class Node
{
    constructor(element)
    {
        this.back = undefined
        this.e = element
    } 
    set_back(node)
    {
        this.back = node_from
        if(node_to!=undefined) node_to.back = node_from
    }
    x()
    {
        return parseInt(this.e.id.split("_")[1])
    }
    y()
    {
        return parseInt(this.e.id.split("_")[2])
    }
    get_g()
    {
        return tinhg(this)    
    }
    get_h()
    {
        if(document.getElementById("astar").checked == true)
        {
            let a = this.x()-cell_to[0]
            let b = this.y()-cell_to[1]
            return Math.sqrt(a*a+b*b)
        }
        else 
        {
            return 0
        }
    }
    get_f()
    {
        return this.get_h()+this.get_g()
    }
}
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
            sml+=   '<div id="_'+x+'_'+y+'" class="Cell"></div>'
            sml+='</div>'
            map[y].push(new Object())
        }
    }
    container.innerHTML = sml+'<canvas id="draw"></canvas>';
    for(y=0;y<size;y++)
    for(x=0;x<size;x++)
    {
        map[x][y] = new Node(document.getElementById("_"+x+"_"+y))
        map[x][y].e.onmouseenter = (e)=>{
           console.log(e.target.id +" = "+left);
           if(left==1)
           {
                let data = e.target.id.split("_")
                if(!e.target.classList.contains("to")&&!e.target.classList.contains("from"))
                {
                    if(xoa == 0 )
                        e.target.classList.remove("light")                  
                    if(them == 0 )
                        e.target.classList.add("light")
                }
           }
        }
    }
    from=true;
    to=true;
    draw = document.getElementById("draw")
    draw.width = container.offsetHeight-10
    draw.height = draw.width
    document.getElementById("size").innerText = Size+"x"+Size
    newrun()
} 
document.addEventListener("mouseup",(e)=>
{
    left = 0
    them = 1
    xoa = 1 
    if(runauto==true) 
    {
        RunView_B()
    }
})
document.addEventListener("mousedown",(e)=>
{
   
    e.preventDefault()
    left=e.buttons
    let cell = e.path[0]
    let data = cell.id.split("_")
    if(data.length==3)
    {
        let x = parseInt(data[1])
        let y = parseInt(data[2])
        if(left==1)
        {
            if(select==1)
            {
                left = 4
                select = 0
            }
            else
            if(select==2)
            {
                left = 2
                select = 0
            }
            else
            if(from==true)
            {
                left = 4
            }
            else
            if(to==true)
            {
                left = 2
            }else
            if(!cell.classList.contains("to")&&!cell.classList.contains("from"))
            {
                if(cell.classList.contains("light"))
                {
                    cell.classList.remove("light")
                    xoa= 0
                }
                else
                {
                    cell.classList.add("light")
                    them =0
                }
            }
        }
        if(left==2)
        {
            if(!cell.classList.contains("light")&&!cell.classList.contains("from"))
            {
                if(cell.classList.contains("to"))
                {
                    cell.classList.remove("to")
                    to = true
                }
                else
                {
                    try{
                        document.getElementById("_"+cell_to[0]+"_"+cell_to[1]).classList.remove("to")
                    }catch{}
                    cell.classList.add("to")
                    cell_to = [x,y]
                    to = false
                    node_to = new Node(cell)
                    left = 0
                }
            }
        }
        if(left==4)
        {
            if(!cell.classList.contains("light")&&!cell.classList.contains("to"))
            {
                if(cell.classList.contains("from"))
                {
                    cell.classList.remove("from")
                    from = false
                    left=0
                }
                else
                {
                    try{
                        document.getElementById("_"+cell_from[0]+"_"+cell_from[1]).classList.remove("from")
                    }catch{}
                    cell.classList.add("from")
                    cell_from = [x,y]
                    from = false
                    node_from = new Node(cell)
                }
            }
        }
        for(j=0;j<Size;j++)
        for(i=0;i<Size;i++)
        {
            map[i][j].set_back()
        }
    }  
})
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
    return s
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

function show(type)
{
    for(let y=0;y<Size;y++)
    for(let x=0;x<Size;x++)
    {
        if(type==1) document.getElementById("_"+x+"_"+y).innerHTML = "<p class='nd' style='font-size:"+250/Size+"px ;'>"+(map[x][y].get_f()).toFixed(1)+"</p>"
        if(type==2) document.getElementById("_"+x+"_"+y).innerHTML = "<p class='nd' style='font-size:"+250/Size+"px ;'>"+(map[x][y].get_g()).toFixed(1)+"</p>"
        if(type==3) document.getElementById("_"+x+"_"+y).innerHTML = "<p class='nd' style='font-size:"+250/Size+"px ;'>"+(map[x][y].get_h()).toFixed(1)+"</p>"
    }
}
var open = new Array()
var close = new Array()
function nodemin()
{
    let min = open[0]
    let vt = 0
    for(i=1;i<open.length;i++)
    {
        if(open[i].get_f()<min.get_f())
        {
            min = open[i]
            vt = i ;
        }
        else if(open[i].get_f()==min.get_f())
        {
            if(open[i].get_g()<min.get_g())
            {
                min = open[i]
                vt = i ;
            }
        }
    }
    open.splice(vt,1)
    return min
}
function isexit(node,clo)
{
    for(i=0;i<clo.length;i++)
    {
        if(clo[i].e.id==node.e.id)
        {
            return i
        }
    }
    return -1
}
function getG(node,back)
{
    a = node.x() - back.x()
    b = node.y() - node.y()
    return Math.sqrt(a*a+b*b)
}
var ar
function addnode(min)
{
    close.push(min)
    ar = new Array()// lưu trữ danh sách tất cả các con
    for(j=-1;j<2;j++)
    for(i=-1;i<2;i++)// Lấy danh sách các con của min
    {   
        if(map[min.x()+i]!=undefined)
        if(map[min.x()+i][min.y()+j]!=undefined) 
        if(map[min.x()+i][min.y()+j].e!=min.e&&
        !map[min.x()+i][min.y()+j].e.classList.contains("light"))
        {
            ar.push(map[min.x()+i][min.y()+j])
        }    
    }
    for( k=0;k<ar.length;k++)//láy từng con ra so sánh
    {
       if(isexit(ar[k],open)==-1&&isexit(ar[k],close)==-1)
       {
            ar[k].back= min
            open.push(ar[k])
       }else
       {
            if(isexit(ar[k],open)!=-1)
            {
                x = new Node(ar[k].e)
                x.back = min
                if(open[isexit(ar[k],open)].get_g()>x.get_g())
                {
                    open[isexit(ar[k],open)].back = min
                }
            }
            if(isexit(ar[k],close)!=-1)
            {
                x = new Node(ar[k].e)
                x.back = min
               if(close[isexit(ar[k],close)].get_g()>x.get_g())
               {
                    ar[k].back = min
                    open.push(ar[k])
                    close.splice(isexit(ar[k],close),1)

               }
            }
       }
       
    }
}
function color()
{
    document.getElementById("slopen").innerText = open.length
    document.getElementById("slclose").innerText = close.length
    clearrun()
    open.forEach(item=>{
        while(item.e.classList.contains("open")||item.e.classList.contains("close"))
        {
            item.e.classList.remove("open")
            item.e.classList.remove("close")
        }
        item.e.classList.add("open")
    })
    close.forEach(item=>{
        while(item.e.classList.contains("open")||item.e.classList.contains("close"))
        {
            item.e.classList.remove("open")
            item.e.classList.remove("close")
        }
        item.e.classList.add("close")
    })
}
var ctx
function back(node)
{
    draw.style.width = (container.offsetHeight-10)+"px"
    draw.style.height = (container.offsetHeight-10)+"px"
    ctx = draw.getContext("2d")
    ctx.clearRect(0,0,draw.width,draw.height)
    ctx.beginPath()
    let x = (node.e.offsetLeft-5)+(node.e.offsetWidth/2)
    let y = (node.e.offsetTop-5)+(node.e.offsetWidth/2)
    ctx.moveTo(x, y)
    let bc = -1;
    while(node!=undefined)
    {
        let x1 = (node.e.offsetLeft-5)+(node.e.offsetWidth/2)
        let y1 = (node.e.offsetTop-5)+(node.e.offsetWidth/2)
        ctx.lineTo(x1, y1)
        ctx.lineWidth = 80/Size;
        ctx.strokeStyle = "#F000F0"
        ctx.stroke()
        node = node.back
        bc++
    }
    slbuoc.innerText = bc
    ctx.closePath()  
}

function clearrun()
{
    for(y=0;y<Size;y++)
        for(x=0;x<Size;x++)
        {
            while(map[x][y].e.classList.contains("open"))
                map[x][y].e.classList.remove("open")
            while(map[x][y].e.classList.contains("close"))
                map[x][y].e.classList.remove("close")
        }
    try{
        ctx.clearRect(0,0,draw.width,draw.height)
    }catch{}
   
}
var RunK
var RunB = false
function RunView_A()
{
    open = new Array()
    close = new Array()
    clearInterval(RunK)
    clearrun()
    open.push(node_from)
    s = 0;
    buoc = 1
    console.clear();
    runauto = true;
    if(from==false&&to==false)
    RunK = setInterval(e=>{
       try{
        let nodenow = nodemin()
        tb=""
        if(nodenow.e == node_to.e) tb = " là điểm đích T("+cell_to[0]+", "+cell_to[1]+"):\n Đường đi được tìm thấy !"
        color()
        back(nodenow)
        if( nodenow.e == node_to.e)
        {
            clearInterval(RunK)
            back(nodenow)
        }else
        {
            s+=100;
        }
        addnode(nodenow)
        time.innerText = s/100
       }
       catch{
        console.clear()
        console.log("Không Tìm Thấy đường đi!");
        color()
       }
    },100)
}
function RunView_B()
{
    open = new Array()
    close = new Array()
    open.push(node_from)
    if(from==false&&to==false)
    {
        try{
            //bắt đầu thuật toán
        open = new Array()
        close = new Array()
        open.push(node_from)// thêm node from vào open
        s = 0;
        while(true)
        {
            let nodenow = nodemin()// lấy node nhỏ nhất trong open ra thêm vào close và loại bỏ khổi open
            addnode(nodenow)//thêm các node mà node đang xet có thể đi đến
            if( nodenow.e == node_to.e)// nếu node đang xét bằng node cần đến thì ngường vòng lập
            {
                time.innerText = parseInt(s/100);
                color()  // in open và close
                back(nodenow)// trả vè đường đi ngắn nhất
                break;
            }
            else{
                s+=100;
            }
        }
        }catch{
            color()
        }       
    } 
}
function newrun()
{
    clearInterval(RunK)
    runauto = false
    clearrun()
}
function makenew()
{
    newrun()
    let x = prompt("Kích thước n (n < 60)","20")
    if(isNaN(parseInt(x)))
    {
        alert("Bạn phải nhập số")
    }
    else
    {
        create_map(parseInt(x))
    }
}
create_map(15)
function f_resize()
{
    container.style.width = container.offsetHeight+"px";
    draw.style.width = (container.offsetHeight-10)+"px"
    draw.style.height = (container.offsetHeight-10)+"px"
}
f_resize()
function copyToClipboard() 
{
    text = getText()
    var input = document.body.appendChild(document.createElement("input"));
    input.value = text;
    input.focus();
    input.select();
    document.execCommand('copy');
    input.parentNode.removeChild(input);
}
function hide()
{
    for(let y=0;y<Size;y++)
    for(let x=0;x<Size;x++)
    { 
        document.getElementById("_"+x+"_"+y).innerHTML = ""
    }
}
document.addEventListener("keyup",(e)=>
{
    e.preventDefault()
    if(e.code=="KeyR")
    {
        RunView_A()
    }else
    if(e.code=="KeyS")
    {
        Result()
    }else
    if(e.code=="KeyN")
    {
        newrun()
    }else
    if(e.code=="KeyU")
    {
        makenew()
    }else
    if(e.code=="KeyC")
    {
        copyToClipboard()
    }else
    if(e.code=="KeyM")
    {
        selectmecung()
    }
    
})

function abc(text)
{
    s = text.split("\n");
    sl=0
    Size = parseInt(s[0])
    create_map(Size)
    for(i=1;i<s.length-1;i++)
    {
        data = s[i].split("-")
        if(data[2]=="100")
        {
            map[parseInt(data[0])][parseInt(data[1])].e.classList.add("light")
        }
    }
}

function random()
{
    create_map(Size)
    for(y=0;y<Size;y++)
    for(x=0;x<Size;x++)
    {
        if(Math.random()<0.4)
        {
            map[x][y].e.classList.add("light");
        }
    }
}
function Result()
{
    runauto=true
    RunView_B()
}