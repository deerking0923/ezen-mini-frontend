import { questions } from './questions'
export function calcResult(answers) {
  const dims={EI:0,TF:0,JP:0}
  Object.entries(answers).forEach(([id,choice])=>{
    const q=questions.find(x=>x.id===+id)
    dims[q.dimension]+= choice===q.options[0]?1:-1
  })
  return `${dims.EI>0?'E':'I'}${dims.TF>0?'T':'F'}${dims.JP>0?'J':'P'}`
}
