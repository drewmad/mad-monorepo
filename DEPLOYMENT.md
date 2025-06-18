# Deployment Checklist

This document outlines the steps to ensure successful deployment to Vercel.

## Pre-Deployment Checklist

### 1. **Code Quality**
- [ ] All TypeScript errors resolved (`pnpm typecheck`)
- [ ] All linting issues fixed (`pnpm lint`)
- [ ] All tests passing (`pnpm test`)
- [ ] Code formatted (`pnpm format`)

### 2. **Dependencies**
- [ ] `pnpm-lock.yaml` exists and is committed
- [ ] No dependency conflicts
- [ ] All workspace packages build successfully (`pnpm build`)

### 3. **Environment Variables**
Set these in Vercel Dashboard → Project Settings → Environment Variables:

**Required:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

**Optional:**
- [ ] `CI_E2E` - Set to `false` to skip E2E tests in CI

### 4. **Vercel Configuration**
Ensure these settings in Vercel:
- [ ] **Node.js Version:** 20.x
- [ ] **Install Command:** `pnpm install --frozen-lockfile --prefer-offline`
- [ ] **Build Command:** `pnpm build`
- [ ] **Output Directory:** `apps/web/.next`

## Deployment Process

### 1. **Automated Validation**
```bash
# Run the complete validation suite
pnpm validate:deploy
```

This checks:
- ✅ Lockfile exists and is committed
- ✅ Dependencies install correctly
- ✅ TypeScript compiles without errors
- ✅ Linting passes
- ✅ All packages build successfully
- ✅ Tests pass

### 2. **Manual Deploy**
```bash
# If validation passes, deploy
git add .
git commit -m "your commit message"
git push origin main
```

### 3. **Monitor Deployment**
- Watch the deployment in Vercel Dashboard
- Check function logs for any runtime errors
- Test the deployed application

## Common Issues & Solutions

### Issue: "No matching version found for eslint"
**Solution:** Ensure all packages use compatible ESLint versions (^8.57.1)

### Issue: "pnpm-lock.yaml is missing"
**Solution:** 
```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: add pnpm-lock.yaml"
```

### Issue: "Environment variable not found"
**Solution:** Check Vercel Dashboard → Environment Variables and ensure all required vars are set

### Issue: "Build failed"
**Solution:** Run `pnpm validate:deploy` locally to catch issues before deployment

## Emergency Rollback

If deployment fails:
1. Check Vercel deployment logs
2. Identify the issue
3. Fix locally and run `pnpm validate:deploy`
4. Redeploy or rollback to previous version in Vercel Dashboard

## Best Practices

- ✅ Always run `pnpm validate:deploy` before pushing
- ✅ Keep `pnpm-lock.yaml` committed
- ✅ Use consistent Node.js version (see `.nvmrc`)
- ✅ Set up proper environment variables
- ✅ Monitor deployments in Vercel Dashboard
- ✅ Test deployed application after each deployment

## Support

If you encounter issues:
1. Check this deployment guide
2. Review Vercel deployment logs
3. Run `pnpm validate:deploy` to identify problems
4. Check environment variables in Vercel Dashboard 