class Superclass {
    constructor(){
        console.log(`---constructor---`)
        console.log(`constructor:\nthis:${this}\nthis.constructor:${this.constructor}\nthis.name:${this.name}\nthis.constructor.name:${this.constructor.name}\n---END--`)
    }
    static stc(){
        console.log(`---static---`)
        let a
        a += 1
        console.log(`static:\nthis:${this}\nthis.constructor:${this.constructor}\nthis.name:${this.name}\nthis.constructor.name:${this.constructor.name}\n---END--`)
    }
    prt(){
        console.log(`---prototype---`)
        console.log(`prototype:\nthis:${this}\nthis.constructor:${this.constructor}\nthis.name:${this.name}\nthis.constructor.name:${this.constructor.name}\n---END--`)
    }
}
class Subclass extends Superclass {
    constructor(){
        super()
        console.log(`---subclass con---`)
        console.log(`sub constructor:\nthis:${this}\nthis.constructor:${this.constructor}\nthis.name:${this.name}\nthis.constructor.name:${this.constructor.name}\n---END--`)
    }
    static stc(){
        console.log(`---sub static---`)
        console.log(`sub static:\nthis:${this}\nthis.constructor:${this.constructor}\nthis.name:${this.name}\nthis.constructor.name:${this.constructor.name}\n---END--`)
    }
    prt() {
        console.log(`---sub prototype---`)
        console.log(`sub prototypr:\nthis:${this}\nthis.constructor:${this.constructor}\nthis.name:${this.name}\nthis.constructor.name:${this.constructor.name}\n---END--`)
    }
}
class NoPrt extends Subclass{
    constructor(){
        super()
        console.log(`---NoPrt con---`)
        console.log(`sub constructor:\nthis:${this}\nthis.constructor:${this.constructor}\nthis.name:${this.name}\nthis.constructor.name:${this.constructor.name}\n---END--`)
    }
    static stc(){
        console.log(`---NoPrt static---`)
        console.log(`sub static:\nthis:${this}\nthis.constructor:${this.constructor}\nthis.name:${this.name}\nthis.constructor.name:${this.constructor.name}\n---END--`)
    }
}
class NoCon extends NoPrt{
}
console.log(`------------------------------------------------------------------------------------------------father------------------------------------------------------------------------------------------------`)
const father = new Superclass()
Superclass.stc()
father.prt()
console.log(father, '\n@@@father end\n')

console.log(`------------------------------------------------------------------------------------------------sub------------------------------------------------------------------------------------------------`)
const child = new Subclass()
Subclass.stc()
child.prt()
console.log(child, '\n@@@child end\n')
console.log(`------------------------------------------------------------------------------------------------nop------------------------------------------------------------------------------------------------`)
const noprt = new NoPrt()
NoPrt.stc()
noprt.prt()
console.log(noprt, '\n@@@noprt end\n')

console.log(`------------------------------------------------------------------------------------------------noc------------------------------------------------------------------------------------------------`)
const nocon = new NoCon()

