import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";

const motivosOptions = ["Trabalho", "Lazer", "Estudo", "Emergência"] as const;

const loginSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  idade: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "Idade deve ser um número válido",
    })
    .refine((val) => Number(val) >= 10 && Number(val) <= 120, {
      message: "Idade deve estar entre 10 e 120 anos",
    }),
  // Alterado para enum para garantir que venha das opções pré-definidas
  motivo: z.enum(motivosOptions, {
    errorMap: () => ({ message: "Por favor, selecione um motivo válido" }),
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar os dados");
      }

      toast.success(`Bem-vindo(a), ${data.nome}! Você será conectado em instantes.`);
      reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Houve um problema ao conectar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="login-form__header">
        <div className="login-form__wifi-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        </div>
        <h1 className="login-form__title">WiFi Gratuito</h1>
        <p className="login-form__subtitle">Saúde Conectada</p>
      </div>

      <div className="login-form__fields">
        <div className="form-group">
          <label htmlFor="nome" className="form-group__label">
            Nome
          </label>
          <input
            id="nome"
            type="text"
            className="form-group__input"
            placeholder="Digite seu nome completo"
            {...register("nome")}
          />
          {errors.nome && (
            <span className="form-group__error">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {errors.nome.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="idade" className="form-group__label">
            Idade
          </label>
          <input
            id="idade"
            type="number"
            min="1"
            max="120"
            className="form-group__input"
            placeholder="Digite sua idade"
            {...register("idade")}
          />
          {errors.idade && (
            <span className="form-group__error">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {errors.idade.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="motivo" className="form-group__label">
            Por que você deseja usar a internet gratuita?
          </label>
          <select
            id="motivo"
            className="form-group__input"
            {...register("motivo")}
            defaultValue=""
          >
            <option value="" disabled>
              Selecione um motivo...
            </option>
            {motivosOptions.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>

          {errors.motivo && (
            <span className="form-group__error">
              {/* ... ícone do SVG ... */}
              {errors.motivo.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="login-form__submit"
          disabled={isLoading}
        >
          {isLoading ? "Conectando..." : "Conectar à Internet"}
        </button>
      </div>

      <div className="login-form__footer">
        <p className="login-form__terms">
          Ao conectar, você concorda com os <a href="#termos">Termos de Uso</a>{" "}
          e <a href="#privacidade">Política de Privacidade</a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
