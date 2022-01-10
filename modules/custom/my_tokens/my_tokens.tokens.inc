<?php
use Drupal\Core\Render\BubbleableMetadata;
use Drupal\taxonomy\Entity\Term;
use Drupal\node\Entity\Node;

/*
* implement hook_token_info()
*/
function my_tokens_token_info() {
  $types['clinics'] = array(
    'name' => t('Clinics'),
    'description' => t('My tokens for Clinics')
  );
  $tokens['clinics_current'] = array(
    'name' => t('Current'),
    'description' => t('Current tid clinics')
  );
  $tokens['clinics_current_name'] = array(
    'name' => t('Current name'),
    'description' => t('Current name clinics')
  );
  $tokens['clinics_current_address'] = array(
    'name' => t('Current address'),
    'description' => t('Current address clinics')
  );
  $tokens['clinics_default'] = array(
    'name' => t('Default'),
    'description' => t('Default tid clinics')
  );

  $types['doctors'] = array(
    'name' => t('Clinics'),
    'description' => t('My tokens for Clinics')
  );
  $tokens_doctor['doctors_nid_in_q'] = array(
    'name' => t('Nid doctors'),
    'description' => t('Nid doctors in reqwest (?doctor_nid=x)')
  );
  $tokens_doctor['doctors_name_in_q'] = array(
    'name' => t('Name doctors'),
    'description' => t('Name doctors in reqwest (?doctor_nid=x)')
  );

  $types['action'] = array(
    'name' => t('Clinics'),
    'description' => t('My tokens for Clinics')
  );
  $tokens_action['action_nid_in_q'] = array(
    'name' => t('Nid action'),
    'description' => t('Nid action in (?action_nid=x)')
  );
  $tokens_action['action_name_in_q'] = array(
    'name' => t('Name action'),
    'description' => t('Name action in (?action_nid=x)')
  );

  return array(
    'types' => $types,
    'tokens' => array(
      'clinics' => $tokens,
      'doctors' => $tokens_doctor,
      'action' => $tokens_action
    ),
  );
}

/*
* implement hook_token()
*/
function my_tokens_tokens($type, $tokens, array $data, array $options, BubbleableMetadata $bubbleable_metadata) {
  $replacements = array();
  if ($type == 'clinics') {
    foreach ($tokens as $name => $original) {
      switch ($name) {
        case 'clinics_current':
          $config = \Drupal::config('my_tokens.settings');
          $current = $config->get('clinics_default');

          if (isset($_COOKIE['current'])) {
            $current = $_COOKIE['current'];
          }

          $replacements[$original] = $current;
          break;
        case 'clinics_current_name':
          $config = \Drupal::config('my_tokens.settings');
          $current = $config->get('clinics_default');

          if (isset($_COOKIE['current'])) {
            $current = $_COOKIE['current'];
          }

          /**
           * @var Drupal\taxonomy\Entity\Term $taxonomy_term
           */

          $taxonomy_term = Term::load($current);
          if ($taxonomy_term){
            $name = $taxonomy_term->get('name')->value;
            
          }
          

          $replacements[$original] = $name;
          break;
        case 'clinics_current_address':
          $config = \Drupal::config('my_tokens.settings');
          $current = $config->get('clinics_default');

          if (isset($_COOKIE['current'])) {
            $current = $_COOKIE['current'];
          }
          /**
           * @var Drupal\taxonomy\Entity\Term $taxonomy_term
           */

          $taxonomy_term = Term::load($current);
          $address = $taxonomy_term->get('field_adres')->value;

          $replacements[$original] = $address;
          break;
        case 'clinics_default':
          $config = \Drupal::config('my_tokens.settings');
          $default = $config->get('clinics_default');

          $replacements[$original] = $default;
          break;
      }
    }
  }
  if ($type == 'doctors') {
    foreach ($tokens as $name => $original) {
      switch ($name) {
        case 'doctors_nid_in_q':

          //получаем из запроса параметр doctor_nid
          //подгружаем доктора
          //проверяем существует ли такой доктор
          //возвращаем nid или '' - если врача нет
          $token = '';
          $nid = \Drupal::request()->query->get('doctor_nid');
          if ($nid) {
            $node = Node::load($nid);
            if ($node) {
              $token = $nid;
            }
          }
          $replacements[$original] = $token;
          break;
        case 'doctors_name_in_q':

          /**
           * @var \Drupal\node\Entity\Node $node
           */

          $token = 'Врач не выбран';
          $nid = \Drupal::request()->query->get('doctor_nid');
          if ($nid) {
            $node = Node::load($nid);
            if ($node) {
              $token = $node->getTitle();
            }
          }
          $replacements[$original] = $token;
          break;
      }
    }
  }
  if ($type == 'action') {
    foreach ($tokens as $name => $original) {
      switch ($name) {
        case 'action_nid_in_q':

          //получаем из запроса параметр doctor_nid
          //подгружаем доктора
          //проверяем существует ли такой доктор
          //возвращаем nid или '' - если врача нет
          $token = '';
          $nid = \Drupal::request()->query->get('action_nid');
          if ($nid) {
            $node = Node::load($nid);
            if ($node) {
              $token = $nid;
            }
          }
          $replacements[$original] = $token;
          break;
        case 'action_name_in_q':

          /**
           * @var \Drupal\node\Entity\Node $node
           */

          $token = 'Акция не выбрана';
          $nid = \Drupal::request()->query->get('action_nid');
          if ($nid) {
            $node = Node::load($nid);
            if ($node) {
              $token = $node->getTitle();
            }
          }
          $replacements[$original] = $token;
          break;
      }
    }
  }
  return $replacements;
}

?>