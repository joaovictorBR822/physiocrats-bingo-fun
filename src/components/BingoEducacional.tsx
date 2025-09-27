import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shuffle, RotateCcw, Users, GraduationCap } from 'lucide-react';

// Lista fixa de palavras sobre Fisiocracia
const PALAVRAS_FISIOCRACIA = [
  "Agricultura", "Terra", "Produto líquido", "Imposto único", "Classe produtiva", 
  "Classe estéril", "Proprietários", "Liberalismo econômico", "Laissez-faire", 
  "França séc. XVIII", "Mercantilismo", "Absolutismo", "François Quesnay", 
  "Quadro econômico", "Ordem natural", "Comércio", "Impostos", "Protecionismo", 
  "Fonte da riqueza", "Renda"
];

// Perguntas para o professor
const PERGUNTAS = [
  "Qual teoria defendia que apenas a agricultura é fonte de riqueza?",
  "Quem foi o principal teórico da Fisiocracia?",
  "O que significa 'Laissez-faire, laissez-passer'?",
  "Qual era a única fonte de imposto defendida pelos fisiocratas?",
  "Em que século surgiu a escola fisiocrática?",
  "Qual classe social os fisiocratas consideravam produtiva?",
  "Como os fisiocratas chamavam os comerciantes e artesãos?",
  "Qual obra de Quesnay representa o fluxo da economia?",
  "Que sistema econômico a Fisiocracia criticava?",
  "Qual era a base da 'ordem natural' segundo os fisiocratas?"
];

type CartellaBingo = string[][];
type GrupoId = 1 | 2 | 3 | 4;

const BingoEducacional = () => {
  const [grupoAtivo, setGrupoAtivo] = useState<GrupoId | null>(null);
  const [celulasMaracadas, setCelulasMaracadas] = useState<Record<GrupoId, boolean[][]>>({
    1: Array(4).fill(null).map(() => Array(4).fill(false)),
    2: Array(4).fill(null).map(() => Array(4).fill(false)),
    3: Array(4).fill(null).map(() => Array(4).fill(false)),
    4: Array(4).fill(null).map(() => Array(4).fill(false))
  });
  const [perguntaAtual, setPerguntaAtual] = useState<string>("");
  const [palavraSorteada, setPalavraSorteada] = useState<string>("");
  const [modoProfessor, setModoProfessor] = useState(false);
  const [bingoVencedores, setBingoVencedores] = useState<Set<GrupoId>>(new Set());

  // Gerar cartelas únicas para cada grupo
  const cartelas = useMemo<Record<GrupoId, CartellaBingo>>(() => {
    const gerarCartela = (seed: number): CartellaBingo => {
      const palavrasEmbaralhadas = [...PALAVRAS_FISIOCRACIA]
        .sort(() => (seed * 9301 + 49297) % 233280 - 116640)
        .slice(0, 16);
      
      const cartela: CartellaBingo = [];
      for (let i = 0; i < 4; i++) {
        cartela.push(palavrasEmbaralhadas.slice(i * 4, (i + 1) * 4));
      }
      return cartela;
    };

    return {
      1: gerarCartela(12345),
      2: gerarCartela(67890),
      3: gerarCartela(54321),
      4: gerarCartela(98765)
    };
  }, []);

  // Verificar se há BINGO
  const verificarBingo = (grupo: GrupoId): boolean => {
    const marcacoes = celulasMaracadas[grupo];
    
    // Verificar linhas
    for (let i = 0; i < 4; i++) {
      if (marcacoes[i].every(cell => cell)) return true;
    }
    
    // Verificar colunas
    for (let j = 0; j < 4; j++) {
      if (marcacoes.every(row => row[j])) return true;
    }
    
    // Verificar diagonais
    if (marcacoes.every((row, i) => row[i])) return true;
    if (marcacoes.every((row, i) => row[3 - i])) return true;
    
    return false;
  };

  // Marcar célula
  const marcarCelula = (grupo: GrupoId, linha: number, coluna: number) => {
    if (bingoVencedores.has(grupo)) return;
    
    setCelulasMaracadas(prev => {
      const novasMarcacoes = { ...prev };
      novasMarcacoes[grupo] = prev[grupo].map((row, i) =>
        row.map((cell, j) => (i === linha && j === coluna) ? !cell : cell)
      );
      
      // Verificar BINGO após marcar
      setTimeout(() => {
        if (verificarBingo(grupo)) {
          setBingoVencedores(prev => new Set([...prev, grupo]));
          alert(`🎉 BINGO! Grupo ${grupo} venceu! 🎉`);
        }
      }, 100);
      
      return novasMarcacoes;
    });
  };

  // Sortear pergunta
  const sortearPergunta = () => {
    const perguntaAleatoria = PERGUNTAS[Math.floor(Math.random() * PERGUNTAS.length)];
    setPerguntaAtual(perguntaAleatoria);
    setPalavraSorteada(""); // Limpar palavra sorteada
  };

  // Sortear palavra
  const sortearPalavra = () => {
    const palavraAleatoria = PALAVRAS_FISIOCRACIA[Math.floor(Math.random() * PALAVRAS_FISIOCRACIA.length)];
    setPalavraSorteada(palavraAleatoria);
    setPerguntaAtual(""); // Limpar pergunta
  };

  // Resetar jogo
  const resetarJogo = () => {
    setCelulasMaracadas({
      1: Array(4).fill(null).map(() => Array(4).fill(false)),
      2: Array(4).fill(null).map(() => Array(4).fill(false)),
      3: Array(4).fill(null).map(() => Array(4).fill(false)),
      4: Array(4).fill(null).map(() => Array(4).fill(false))
    });
    setBingoVencedores(new Set());
    setPerguntaAtual("");
    setPalavraSorteada("");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Bingo Educacional: Fisiocracia
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aprenda sobre a escola econômica francesa do século XVIII de forma interativa e divertida!
          </p>
        </div>

        {/* Navegação */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            variant={modoProfessor ? "outline" : "default"}
            onClick={() => {
              setModoProfessor(false);
              setGrupoAtivo(null);
            }}
            className="flex items-center gap-2"
          >
            <Users size={20} />
            Grupos
          </Button>
          <Button
            variant={modoProfessor ? "default" : "outline"}
            onClick={() => {
              setModoProfessor(true);
              setGrupoAtivo(null);
            }}
            className="flex items-center gap-2"
          >
            <GraduationCap size={20} />
            Painel do Professor
          </Button>
          <Button
            variant="destructive"
            onClick={resetarJogo}
            className="flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Resetar Jogo
          </Button>
        </div>

        {/* Conteúdo Principal */}
        {!modoProfessor && !grupoAtivo && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((grupo) => (
              <Card key={grupo} className="group-card">
                <div className="text-center">
                  <div className="mb-4">
                    <Badge 
                      variant={bingoVencedores.has(grupo as GrupoId) ? "default" : "secondary"}
                      className={`text-lg px-4 py-2 ${
                        bingoVencedores.has(grupo as GrupoId) 
                          ? 'bg-success text-success-foreground' 
                          : ''
                      }`}
                    >
                      {bingoVencedores.has(grupo as GrupoId) ? '🏆 ' : ''}
                      Grupo {grupo}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => setGrupoAtivo(grupo as GrupoId)}
                    className="w-full"
                    disabled={bingoVencedores.has(grupo as GrupoId)}
                  >
                    Ver Minha Cartela
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Cartela do Grupo */}
        {grupoAtivo && !modoProfessor && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <Button
                variant="outline"
                onClick={() => setGrupoAtivo(null)}
                className="mb-4"
              >
                ← Voltar aos Grupos
              </Button>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Cartela do Grupo {grupoAtivo}
              </h2>
              {bingoVencedores.has(grupoAtivo) && (
                <Badge className="bg-success text-success-foreground text-lg px-4 py-2">
                  🏆 BINGO! Você venceu! 🏆
                </Badge>
              )}
            </div>
            
            <div className="bingo-grid">
              {cartelas[grupoAtivo].map((linha, i) =>
                linha.map((palavra, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`bingo-cell ${
                      celulasMaracadas[grupoAtivo][i][j] ? 'marked' : ''
                    }`}
                    onClick={() => marcarCelula(grupoAtivo, i, j)}
                  >
                    {palavra}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Painel do Professor */}
        {modoProfessor && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="teacher-panel">
              <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                Painel do Professor
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Sorteio de Perguntas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Sorteio de Perguntas</h3>
                  <Button
                    onClick={sortearPergunta}
                    className="w-full flex items-center gap-2"
                  >
                    <Shuffle size={20} />
                    Sortear Pergunta
                  </Button>
                  {perguntaAtual && (
                    <div className="question-card">
                      <h4 className="font-medium mb-2">Pergunta Sorteada:</h4>
                      <p className="text-warning-foreground">{perguntaAtual}</p>
                    </div>
                  )}
                </div>

                {/* Sorteio de Palavras */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Sorteio de Palavras</h3>
                  <Button
                    onClick={sortearPalavra}
                    variant="secondary"
                    className="w-full flex items-center gap-2"
                  >
                    <Shuffle size={20} />
                    Sortear Palavra
                  </Button>
                  {palavraSorteada && (
                    <div className="question-card">
                      <h4 className="font-medium mb-2">Palavra Sorteada:</h4>
                      <p className="text-2xl font-bold text-warning-foreground">
                        {palavraSorteada}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status dos Grupos */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Status dos Grupos</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((grupo) => (
                    <div
                      key={grupo}
                      className={`p-4 rounded-lg border-2 text-center ${
                        bingoVencedores.has(grupo as GrupoId)
                          ? 'bg-success/10 border-success'
                          : 'bg-card border-border'
                      }`}
                    >
                      <div className="font-semibold">Grupo {grupo}</div>
                      {bingoVencedores.has(grupo as GrupoId) ? (
                        <div className="text-success font-bold">🏆 VENCEDOR</div>
                      ) : (
                        <div className="text-muted-foreground">Jogando...</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BingoEducacional;