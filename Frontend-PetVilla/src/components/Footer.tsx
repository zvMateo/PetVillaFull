import { Link } from "react-router-dom";
import { PawPrint, ThumbsUp, Share2, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-pet-primary rounded-lg flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PetVilla</span>
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              Conectamos a las mascotas con los mejores profesionales
              veterinarios de Argentina.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-pet-primary hover:text-white transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-pet-primary hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-pet-primary hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Plataforma</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/clinics"
                  className="text-gray-600 hover:text-pet-primary transition-colors"
                >
                  Buscar Veterinaria
                </Link>
              </li>
              <li>
                <Link
                  to="/#how-it-works"
                  className="text-gray-600 hover:text-pet-primary transition-colors"
                >
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-600 hover:text-pet-primary transition-colors"
                >
                  Precios para Veterinarias
                </Link>
              </li>
              <li>
                <Link
                  to="/app"
                  className="text-gray-600 hover:text-pet-primary transition-colors"
                >
                  App Móvil
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Empresa</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-pet-primary transition-colors"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-gray-600 hover:text-pet-primary transition-colors"
                >
                  Trabajá con Nosotros
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-600 hover:text-pet-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-pet-primary transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-pet-primary transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-600 hover:text-pet-primary transition-colors"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-gray-600 hover:text-pet-primary transition-colors"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2025 PetVilla Argentina. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
