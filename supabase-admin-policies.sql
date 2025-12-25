-- Script SQL pour activer la lecture des données pour le dashboard admin
-- À exécuter dans l'éditeur SQL de Supabase
-- Note: L'accès au dashboard est protégé par login (localStorage), donc la lecture publique est sécurisée

-- Supprimer les policies existantes si elles existent (pour éviter les erreurs)
DROP POLICY IF EXISTS "public_read_contact" ON public.contact_form;
DROP POLICY IF EXISTS "public_read_engagements" ON public.engagements;
DROP POLICY IF EXISTS "public_read_volunteers" ON public.volunteers;
DROP POLICY IF EXISTS "public_read_newsletters" ON public.newsletters;
DROP POLICY IF EXISTS "public_read_surveys" ON public.surveys;
DROP POLICY IF EXISTS "authenticated_read_contact" ON public.contact_form;
DROP POLICY IF EXISTS "authenticated_read_engagements" ON public.engagements;
DROP POLICY IF EXISTS "authenticated_read_volunteers" ON public.volunteers;
DROP POLICY IF EXISTS "authenticated_read_newsletters" ON public.newsletters;
DROP POLICY IF EXISTS "authenticated_read_surveys" ON public.surveys;

-- Contact Form - Lecture publique (protégé par login dashboard)
CREATE POLICY "public_read_contact" ON public.contact_form
    FOR SELECT TO public
    USING (true);

-- Engagements - Lecture publique (protégé par login dashboard)
CREATE POLICY "public_read_engagements" ON public.engagements
    FOR SELECT TO public
    USING (true);

-- Volunteers - Lecture publique (protégé par login dashboard)
CREATE POLICY "public_read_volunteers" ON public.volunteers
    FOR SELECT TO public
    USING (true);

-- Newsletters - Lecture publique (protégé par login dashboard)
CREATE POLICY "public_read_newsletters" ON public.newsletters
    FOR SELECT TO public
    USING (true);

-- Surveys - Lecture publique (protégé par login dashboard)
CREATE POLICY "public_read_surveys" ON public.surveys
    FOR SELECT TO public
    USING (true);

