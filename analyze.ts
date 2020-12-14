import * as ts from "typescript"
import { readFileSync } from "fs"

function assertIsNotUndefined<T>(x: T | undefined, message: string = "unexpected undefined"): asserts x is T {
  if (x === undefined) {
    throw new TypeError(message)
  }
}

const filename = "src/main.ts"
const tsconfig = ts.readConfigFile("tsconfig.json", (path: string) => readFileSync(path, "utf-8"))
const compilerOptions: ts.CompilerOptions = ts.convertCompilerOptionsFromJson(tsconfig.config.compilerOptions, ".").options
const program: ts.Program = ts.createProgram([filename], compilerOptions)
const sourceFile: ts.SourceFile | undefined = program.getSourceFile(filename)
assertIsNotUndefined(sourceFile)

function findDistDeclaration(
  node: ts.Node
): ts.FunctionDeclaration | undefined {
  if (
    ts.isFunctionDeclaration(node) &&
    node.name !== undefined &&
    ts.idText(node.name) === "dist"
  ) {
    return node
  }

  return ts.forEachChild(node, findDistDeclaration)
}

const distDecl = ts.forEachChild(sourceFile, findDistDeclaration)
assertIsNotUndefined(distDecl, `declaration of dist is not found`)

const checker: ts.TypeChecker = program.getTypeChecker()
const paramType: ts.Type | undefined = checker.getTypeAtLocation(
  distDecl.parameters[0]
)
assertIsNotUndefined(paramType, `type of 1st parameter of dist is not found`)

const symbol: ts.Symbol | undefined = paramType.getSymbol()
assertIsNotUndefined(symbol, `symbol of Point is not found`)

const typeDecls: ts.Declaration[] | undefined = symbol.getDeclarations()
assertIsNotUndefined(typeDecls, `declarations of Point is not found`)
console.log(
  ts.createPrinter().printList(
    ts.ListFormat.MultiLine | ts.ListFormat.NoTrailingNewLine,
    ts.factory.createNodeArray(typeDecls),
    sourceFile
  )
)
