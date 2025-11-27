import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Check, ScanFace, ArrowRight, Save } from 'lucide-react';
import { verifyCredentials, UserSession, updatePassword } from '../services/dataService';

interface LoginScreenProps {
  onLoginSuccess: (user: UserSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // New Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [pendingUser, setPendingUser] = useState<UserSession | null>(null);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Avatar Animation State
  const avatarRef = useRef<HTMLDivElement>(null);
  const [avatarOffset, setAvatarOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!avatarRef.current) return;

      // Get the center of the avatar
      const rect = avatarRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Dampen the movement (divide by a factor) and clamp it
      const maxMove = 10; // Maximum pixels the eye can move
      const dampening = 20; // Higher number = slower/less movement

      const moveX = Math.max(-maxMove, Math.min(maxMove, deltaX / dampening));
      const moveY = Math.max(-maxMove, Math.min(maxMove, deltaY / dampening));

      setAvatarOffset({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- VALIDATION ---
    if (!username || username.trim().length === 0) {
        setError('O nome de usuário não pode estar vazio.');
        setLoading(false);
        return;
    }
    if (!/^[A-Z0-9]+$/.test(username)) {
        setError('Usuário deve conter apenas letras e números.');
        setLoading(false);
        return;
    }

    try {
      const user = await verifyCredentials(username, password);
      
      if (user) {
        // Check if password is default '123'
        if (password === '123') {
          setIsChangingPassword(true);
          setPendingUser(user);
          setLoading(false);
          return;
        }

        onLoginSuccess(user);
      } else {
        setError('Usuário ou senha inválidos.');
        setLoading(false);
      }
    } catch (err) {
      setError('Erro ao conectar com o banco de dados.');
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    if (newPassword === '123') {
      setError('A nova senha não pode ser igual a senha padrão.');
      return;
    }

    if (newPassword.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    setLoading(true);

    try {
        const success = await updatePassword(username, newPassword);
        
        if (success) {
            setSuccessMsg('Senha alterada com sucesso!');
            
            // Allow login after a short delay using the pending user info
            setTimeout(() => {
               if (pendingUser) {
                 onLoginSuccess(pendingUser);
               }
            }, 1500);
        } else {
            setError('Erro ao atualizar senha. Tente novamente.');
            setLoading(false);
        }

    } catch (e) {
        setError('Erro crítico ao salvar senha.');
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-800 via-slate-900 to-black font-sans">
      
      {/* Background Glow Effects */}
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-sm p-8 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-500">
        
        {/* User Icon Circle */}
        <div 
            ref={avatarRef}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-sky-500/50 border-2 border-white/10 flex items-center justify-center shadow-lg"
        >
          <ScanFace 
            className="w-12 h-12 text-white font-light transition-transform duration-100 ease-out" 
            strokeWidth={1.5}
            style={{ 
                transform: `translate(${avatarOffset.x}px, ${avatarOffset.y}px)` 
            }}
          />
        </div>

        {/* --- CHANGE PASSWORD FORM --- */}
        {isChangingPassword ? (
           <form onSubmit={handlePasswordChange} className="mt-12 flex flex-col gap-5">
              <div className="text-center text-white mb-2">
                 <h3 className="text-lg font-bold">Alterar Senha Padrão</h3>
                 <p className="text-xs text-blue-200">Por segurança, altere sua senha '123'.</p>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400"/>
                </div>
                <input
                  type="password"
                  required
                  placeholder="NOVA SENHA"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-slate-900/70 transition-all"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Check className="h-5 w-5 text-gray-400"/>
                </div>
                <input
                  type="password"
                  required
                  placeholder="CONFIRMAR SENHA"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-slate-900/70 transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

               {error && (
                <div className="text-red-300 text-center text-sm font-medium bg-red-900/30 py-1 rounded border border-red-500/30">
                  {error}
                </div>
              )}
              
              {successMsg && (
                <div className="text-green-300 text-center text-xs font-medium bg-green-900/30 py-2 rounded border border-green-500/30 animate-pulse">
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !!successMsg}
                className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-widest uppercase text-sm rounded shadow-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-white/5 flex items-center justify-center gap-2"
              >
                {loading ? 'Salvando...' : (
                    <>
                        <Save className="w-4 h-4" />
                        Salvar e Entrar
                    </>
                )}
              </button>
           </form>
        ) : (
        /* --- LOGIN FORM --- */
        <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-5">
          
          {/* Username Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400"/>
            </div>
            <input
              type="text"
              required
              placeholder="USUÁRIO"
              className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-slate-900/70 transition-all uppercase"
              value={username}
              onChange={(e) => setUsername(e.target.value.toUpperCase())}
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400"/>
            </div>
            <input
              type="password"
              required
              placeholder="SENHA"
              className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-slate-900/70 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Controls: Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs text-gray-300 mt-1">
            <label className="flex items-center cursor-pointer select-none">
              <div 
                className={`w-4 h-4 mr-2 border border-gray-400 rounded flex items-center justify-center transition-colors ${rememberMe ? 'bg-blue-600 border-blue-600' : 'bg-transparent'}`}
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && <Check className="w-3 h-3 text-white" />}
              </div>
              <span>Lembrar-me</span>
            </label>
            <a 
              href="" 
              className="italic hover:text-white transition-colors group relative"
            >
              Esqueceu a senha?
              <span className="absolute bottom-full mb-2 right-0 hidden group-hover:block w-56 bg-slate-800 text-white text-[10px] p-3 rounded shadow-lg z-20 text-center border border-white/10">
                 Entre em contato com <strong className="text-blue-300">Benjamim</strong> ou <strong className="text-blue-300">Yago</strong> para redefinir.
              </span>
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-300 text-center text-sm font-medium bg-red-900/30 py-1 rounded">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-[#2D89C8] hover:bg-[#2573a8] text-white font-bold tracking-widest uppercase text-sm rounded shadow-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-white/5 flex items-center justify-center gap-2"
          >
            {loading ? 'Verificando...' : (
                <>
                    Entrar <ArrowRight className="w-4 h-4" />
                </>
            )}
          </button>
        </form>
        )}
      </div>
    </div>
  );
};